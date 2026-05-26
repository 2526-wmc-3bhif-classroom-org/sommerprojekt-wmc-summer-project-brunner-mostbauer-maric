# Frontend Codebase Analysis: Driving Planer Vue 3 Application

## Executive Summary

The frontend is a Vue 3 Composition API application (with TypeScript) using Vite as the build tool, Pinia for state management, and Tailwind CSS for styling. The codebase shows moderate organization but has several architectural issues related to data fetching, state management, and redundant API calls that should be addressed.

---

## 1. Folder Organization

### Current Structure:
```
src/
├── App.vue                    # Root component with backend health check
├── main.ts                    # Application entry point
├── types.ts                   # Shared TypeScript interfaces
├── assets/                    # Static assets (CSS, images)
├── components/                # Reusable Vue components
│   ├── icons/                 # Icon SVG components
│   ├── Background.vue
│   ├── CardMain.vue
│   ├── DrivingSchoolLine.vue
│   ├── FooterCmp.vue
│   ├── HeaderMain.vue
│   ├── InfoStatsCard.vue
│   ├── Navbar.vue
│   ├── NavbarLinks.vue
│   ├── StatisticCard.vue
│   └── Timeline.vue
├── i18n/                      # Internationalization setup
├── router/                    # Vue Router configuration
├── stores/                    # Pinia state management
│   ├── authStore.ts
│   ├── schoolStore.ts
│   └── userStore.ts
└── views/                     # Page components
    ├── auth/                  # Authentication pages
    ├── AboutView.vue
    ├── ContactView.vue
    ├── Dashboard.vue
    ├── DrivingSchoolView.vue
    ├── DrivingSchoolManageView.vue
    ├── HomeView.vue
    ├── ImpressumView.vue
    ├── ProfilView.vue
    └── StartForm.vue
```

### Organization Assessment:
- **Strengths:**
  - Clear separation between views, components, and stores
  - Centralized type definitions in `types.ts`
  - Authentication views properly isolated
  - Small component library is well-organized

- **Issues:**
  - No utilities/composables folder for reusable logic
  - No API client/services layer (API calls scattered throughout views and stores)
  - No middleware or interceptor pattern
  - No constants file for API endpoints, cache keys, etc.

---

## 2. Data Fetching & Management Patterns

### Current Approach: Scattered Direct Fetch Calls

**Problem:** The application uses inline `fetch()` calls throughout the codebase rather than a centralized API client. This appears in:

1. **Store Files:**
   - `authStore.ts`: Login, register, enrollment checks
   - `schoolStore.ts`: Fetch schools, ratings, count
   - `userStore.ts`: Fetch user count

2. **View Components:**
   - `Dashboard.vue`: ~15+ fetch calls for KM logs, tasks, events, calendar, enrollments, school info
   - `DrivingSchoolView.vue`: Fetch schools and ratings
   - `ProfilView.vue`: Fetch school data, upload avatar, delete avatar
   - `StartForm.vue`: Fetch programs
   - `HomeView.vue`: Fetch school and user counts
   - `DrivingSchoolManageView.vue`: Multiple API calls for courses (not shown in excerpt, but visible in template logic)

### Examples of API Call Patterns:

```typescript
// Pattern 1: In stores (authStore.ts:21-45)
async function login(credentials: { email: string; password: string }) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  // error handling...
}

// Pattern 2: In views (Dashboard.vue:437-448)
const fetchKmLogs = async () => {
  try {
    const res = await fetch(`${API_URL}/kmlog`, {
      headers: { Authorization: `Bearer ${authStore.token ?? ''}` }
    })
    if (res.ok) {
      kmEntries.value = await res.json()
    }
  } catch (err) {
    console.error("Failed to fetch KM logs:", err)
  }
}

// Pattern 3: In components (DrivingSchoolLine.vue:100-104)
async function setRating(stars: number) {
  const currentRating = userRating.value
  const newRating = currentRating === stars ? 0 : stars
  await schoolStore.setRating(props.school.DrivingSchoolId, newRating)
}
```

### Issues Identified:

1. **No Centralized API Client:**
   - `API_URL` is repeated in multiple files:
     - `authStore.ts`: line 5
     - `userStore.ts`: line 4
     - `schoolStore.ts`: line 5
     - `Dashboard.vue`: line 361
     - `ProfilView.vue`: line 249
     - `StartForm.vue`: line 83
   - Authorization header construction is duplicated across files
   - No request/response interceptors for error handling

2. **Inconsistent Error Handling:**
   - Some calls log errors, some silently fail
   - No global error handling or toast notifications
   - 401 responses trigger logout but only in some stores (schoolStore.ts, userStore.ts)
   - authStore.ts handles auth errors differently

3. **Manual Token Management:**
   - Every fetch call manually constructs Authorization header
   - Token is accessed from `authStore.token` in multiple places
   - No automatic token refresh mechanism

---

## 3. Redundant API Calls & Performance Bottlenecks

### A. Redundant Calls

#### 1. **Rating Data Fetching** (schoolStore.ts)
```typescript
// setRating (line 53-96) calls fetchRatings() on EVERY rating change
async function setRating(schoolId: number, stars: number) {
  // ... API call to set rating ...
  if (response.ok) {
    await fetchRatings()  // Fetches ALL ratings for entire app
    return true
  }
}
```
**Issue:** After every single rating change, the entire ratings list is re-fetched. This should update optimistically or only refetch if needed.

**Impact:** 
- If 50 schools have ratings and user rates one school, entire dataset refreshed
- Network: 1 unnecessary full dataset fetch per rating change

#### 2. **Task Fetching** (Dashboard.vue)
```typescript
// addCheck (line 614-625)
const addCheck = async () => {
  if (!checkInput.value.trim()) { taskError.value = true; return }
  const res = await fetch(`${API_URL}/tasks`, { ... })
  if (res.ok) {
    checkInput.value = ''
    await fetchTasks()  // Re-fetches entire task list
  }
}
```
**Issue:** After adding a single task, entire task list is re-fetched unnecessarily.

#### 3. **Enrollment Check Duplication** (authStore.ts + Dashboard.vue)
- `authStore.ts` (line 48-64): Checks enrollments after login
- `Dashboard.vue` (line 747-773): Checks enrollments again in onMounted
```typescript
// authStore.ts:48-64
if (!isEnrolled) {
  try {
    const enrollRes = await fetch(`${API_URL}/users/${data.user.UserId}/enrollments`, ...)
    // ... check logic ...
  }
}

// Dashboard.vue:747-773
const enrollRes = await fetch(`${API_URL}/users/${userId}/enrollments`, ...)
// Same call made again!
```
**Issue:** Enrollment data is fetched twice for the same user during initial page load.

#### 4. **School Count Fetching** (HomeView.vue)
```typescript
// HomeView.vue:112-115
onMounted(async () => {
  await schoolStore.fetchSchoolCount()  // One call
  await userStore.fetchUsersCount()
})

// Also called in DrivingSchoolView but schools themselves are fetched separately
```
**Issue:** School count endpoint exists but full school list is also fetched separately.

#### 5. **School Data Redundancy** (DrivingSchoolView.vue)
```typescript
// DrivingSchoolView.vue:217-220
onMounted(async () => {
  isLoading.value = true
  await Promise.all([
    schoolStore.fetchSchools(),
    schoolStore.fetchRatings()    // Gets ALL ratings
  ])
})
```
**Issue:** If ratings are fetched again when user rates a school (see schoolStore.ts:88), you have duplicate data.

#### 6. **Profile School Data Fetching** (ProfilView.vue)
```typescript
// ProfilView.vue:289-297
if (authStore.isSchool && authStore.user.DrivingSchoolId) {
  try {
    const res = await fetch(`${API_URL}/schools/${authStore.user.DrivingSchoolId}`, ...)
    if (res.ok) {
      const school = await res.json()
      // Extract individual fields...
    }
  }
}
```
**Issue:** For school users, this fetches their own school data. This data might already be available or could be stored in auth response.

### B. Performance Bottlenecks

#### 1. **Dashboard View: 6+ Sequential Fetch Calls**
```typescript
// Dashboard.vue:739-787 (onMounted)
onMounted(async () => {
  if (authStore.user?.UserId) {
    const userId = String(authStore.user.UserId)
    fetchKmLogs()       // Call 1 - not awaited
    fetchTasks()        // Call 2 - not awaited
    fetchEvents()       // Call 3 - not awaited
    // ...
    const enrollRes = await fetch(...)  // Call 4 - AWAITED
    // Inside enrollRes:
    if (enrollRes.ok) {
      // ... then fetches school data:
      const res = await fetch(...)      // Call 5 - AWAITED
    }
  }
})
```
**Issues:**
- Multiple independent async operations not using Promise.all()
- Sequential waiting chains (enrollments must complete before school fetch)
- No loading state until all data arrives

**Waterfall Effect:**
```
fetchKmLogs -------|
fetchTasks --------|
fetchEvents -------|
enrollments -------|------> school ---|
           total: ~5-7 requests taking multiple round trips
```

#### 2. **Authentication Flow: Double Enrollments Check**
After login, enrollment is checked in two places:
1. `authStore.login()` (line 48-64)
2. `Dashboard.onMounted()` (line 747-773)

Both check `/users/{userId}/enrollments` endpoint.

#### 3. **Calendar Events Calculation**
```typescript
// Dashboard.vue:709-730
function recalculateExamDates(goal: string | null, startDateStr: string | null, course: any) {
  // Complex date calculations done every time component mounts
  // No memoization or caching
}
```
**Issue:** Exam date calculations happen on every component mount, should be cached if inputs haven't changed.

---

## 4. Store Implementations Analysis

### A. authStore.ts

**Responsibilities:**
- Authentication (login, register, logout)
- User state persistence (sessionStorage)
- Role-based computed properties (isAdmin, isSchool, isStudent)
- User info management
- Enrollment checks (mixed concern)

**Issues:**
1. **Mixed Concerns:**
   - Post-login routing logic (lines 46-71) should be in router guards, not store
   - Enrollment checking is a business logic concern but mixed with auth

2. **Session Storage Coupling:**
   - Uses `sessionStorage` directly (not abstracted)
   - Hard to test or mock storage
   - No abstraction layer for persistence

3. **Incomplete Error Handling:**
   - Some errors caught as `catch (e)` without logging (line 100, 127)
   - Fallback logic in try-catch but no structured error reporting

4. **Token Management:**
   - No token expiration checking
   - No refresh token handling
   - Manual header construction every call

**Code Smell:**
```typescript
// Line 46-71: Router navigation logic in store action
if(!fromRegister) {
  if(data.user.Role === UserRole.USER) {
    let isEnrolled = sessionStorage.getItem(`enrolled_${data.user.UserId}`) === 'true'
    // ... complex enrollment logic ...
    await router.push(isEnrolled ? '/dashboard' : '/start')
  } else if(data.user.Role === UserRole.ADMIN) {
    await router.push('/dashboard')
  } else if(data.user.Role === UserRole.SCHOOL){
    await router.push('/manage')
  }
}
```

### B. schoolStore.ts

**Responsibilities:**
- Fetch driving schools list
- Manage ratings
- Fetch schools count

**Issues:**
1. **Overly Broad State:**
   - Stores both `schools` and `ratings` (unrelated data)
   - Single store mixing different concerns

2. **Inefficient Rating Updates:**
   ```typescript
   async function setRating(schoolId: number, stars: number) {
     // ... API call ...
     if (response.ok) {
       await fetchRatings()  // Fetches ALL ratings every time!
       return true
     }
   }
   ```
   - No optimistic updates
   - Full dataset refresh on single change

3. **Type Safety Issues:**
   ```typescript
   const ratings = ref<any[]>([])  // Uses 'any' type
   ```
   - Should use `Rating[]` from types.ts

4. **Inconsistent Auth Header Pattern:**
   ```typescript
   // fetchSchools has auth header check (line 16)
   if (authStore.token) {
     headers['Authorization'] = `Bearer ${authStore.token}`
   }
   
   // fetchRatings does NOT check auth (line 44-46)
   const response = await fetch(`${API_URL}/ratings`)
   // Public endpoint assumption?
   ```

### C. userStore.ts

**Responsibilities:**
- Fetch total user count

**Issues:**
1. **Single Purpose, Minimal Logic:**
   - Only fetches user count
   - Could be a utility function or combined with another store

2. **Generic State Name:**
   ```typescript
   const countOfTotalUsers = ref<number>(0)
   ```
   - Should be more specific: `totalUsersCount` or `globalUsersCount`

3. **Inconsistent Logout Pattern:**
   ```typescript
   if (response.status === 401) {
     authStore.logout()
     return
   }
   ```
   - This logout on 401 pattern should be centralized (middleware/interceptor)

---

## 5. Overall Code Quality & Organization Issues

### A. High-Priority Issues

#### 1. **No API Service Layer**
**Problem:** API calls are scattered across 7+ files with duplicated logic.

**Current:**
```
Views/Stores -> Direct fetch() calls -> API
```

**Recommended:**
```
Views/Stores -> API Service/Client -> fetch() -> API
```

**Impact:**
- Hard to test
- Duplication of headers, error handling
- Difficult to add global interceptors
- No place to handle retries, caching

#### 2. **Inconsistent Authorization Handling**
- Different stores handle 401 differently
- Some check token existence, some don't
- Manual header construction everywhere
- No central token refresh mechanism

**Files affected:**
- authStore.ts, schoolStore.ts, userStore.ts, ProfilView.vue, Dashboard.vue

#### 3. **SessionStorage as Primary State**
```typescript
// authStore.ts:13-14
const user = ref<User | null>(JSON.parse(sessionStorage.getItem('user') || 'null'))
const token = ref<string | null>(sessionStorage.getItem('token'))

// ProfilView.vue:353-356
const user: User = JSON.parse(<string>sessionStorage.getItem('user'))
user.UserName = displayName.value
sessionStorage.setItem('user', JSON.stringify(user))
```

**Issues:**
- Direct sessionStorage access in components
- No single source of truth
- Manual serialization/deserialization
- Race conditions possible with multiple updates

#### 4. **No Data Caching Strategy**
**Current behavior:** Every time component mounts, fresh API call is made.

**Examples:**
- Schools list fetched every time DrivingSchoolView mounts
- Tasks list fetched every time Dashboard mounts
- Same school ratings fetched multiple times
- User count fetched on every HomeView mount

#### 5. **Missing Error UI/UX**
- Errors logged to console but not shown to user
- No toast notifications
- Silent failures in multiple places
- No loading states for many operations

### B. Medium-Priority Issues

#### 1. **Mixed Business Logic in Components**
```typescript
// Dashboard.vue:709-730: Complex date calculations in component
function recalculateExamDates(goal: string | null, startDateStr: string | null, course: any) {
  if (!goal || !startDateStr) return
  const pace = examPaceMap[goal]
  if (!pace) return
  // 10+ lines of date math...
}
```
**Should be:** Utility function in separate file

#### 2. **Weak Type Safety**
```typescript
// schoolStore.ts:9
const ratings = ref<any[]>([])

// Dashboard.vue:374
dates.value = (data ?? []).map((e: any) => ({ ... }))

// DrivingSchoolManageView.vue (likely)
course: any
```
**Should use:** Proper types from types.ts

#### 3. **Magic Strings & Numbers**
```typescript
// Dashboard.vue:79
const examPaceMap: Record<string, { theorie: number; praxis: number }> = {
  fast:    { theorie: 14,  praxis: 28  },
  normal:  { theorie: 42,  praxis: 84  },
  relaxed: { theorie: 90,  praxis: 180 },
}
```
**Should be:** Constants file or store

#### 4. **Long Component Files**
- Dashboard.vue: 824 lines (massive)
- ProfilView.vue: 434 lines
- DrivingSchoolManageView.vue: 575+ lines

**Should extract:**
- Modal components
- Reusable form sections
- Business logic into composables

#### 5. **No Input Validation Centralization**
```typescript
// Dashboard.vue:451-461
const addKmEntry = async () => {
  if (kmStart.value === null || kmEnd.value === null || !locStart.value || !locEnd.value || !conditions.value.trim()) {
    kmErrorCode.value = 'fillAll'
    kmError.value = t('dashboard.kmLog.errors.fillAll')
    return
  }
  if (kmEnd.value < kmStart.value) {
    kmErrorCode.value = 'endKmGreater'
    kmError.value = t('dashboard.kmLog.errors.endKmGreater')
    return
  }
  // ...
}
```
**Should use:** Form validation library or composable

### C. Low-Priority Issues

#### 1. **Unused Imports/Code**
- App.vue performs backend health check on every app load (unnecessary)
- Some icon components may be unused

#### 2. **Inconsistent Naming**
- `schoolStore` vs `userStore` vs `authStore` (inconsistent suffixes)
- `countOfTotalUsers` vs `countOfSchools` vs `schools` (inconsistent patterns)
- `fetchSchools()` vs `fetchSchoolCount()` (inconsistent verb patterns)

#### 3. **Missing JSDoc Comments**
- No documentation for complex functions
- Store actions lack parameter descriptions
- No return type documentation

---

## 6. Data Flow Issues

### Current Data Flow Problems:

```
User Login
    ↓
authStore.login() 
    ├→ Fetch credentials
    ├→ Parse response
    ├→ Save to sessionStorage
    ├→ Check enrollments (sessionStorage lookup + API if needed)
    └→ Navigate to dashboard/start
    
User Views Dashboard
    ↓
Dashboard.vue onMounted()
    ├→ fetchKmLogs()        [no await]
    ├→ fetchTasks()         [no await]  
    ├→ fetchEvents()        [no await]
    ├→ fetch enrollments    [AWAIT - depends on]
    │   ├→ fetch school     [sequential]
    │   └→ recalculate dates
    ├→ updateCalendar()
    └→ render

Problems:
- 6+ API calls for single view
- Waterfall dependencies
- No caching between views
- Mixed concerns (auth + business logic)
```

---

## 7. Recommendations Summary

### Priority 1 (Critical):
1. Create API client/service layer
2. Centralize authorization handling
3. Implement global error handling
4. Add data caching strategy

### Priority 2 (Important):
1. Extract modal components from large views
2. Move business logic to composables
3. Standardize error messages
4. Type all API responses properly

### Priority 3 (Nice-to-have):
1. Add request/response logging
2. Implement optimistic updates for mutations
3. Add offline support
4. Create form validation composables

---

## File-by-File Issues Summary

| File | Lines | Issues | Severity |
|------|-------|--------|----------|
| Dashboard.vue | 824 | Massive size, 6+ fetches, mixed concerns | High |
| ProfilView.vue | 434 | Duplicated API calls, large size | Medium |
| DrivingSchoolManageView.vue | 575+ | Large, multiple modals, complex logic | Medium |
| authStore.ts | 131 | Mixed router logic, weak error handling | Medium |
| schoolStore.ts | 98 | Uses `any[]`, inefficient rating updates | Medium |
| userStore.ts | 29 | Minimal, could be utility | Low |
| DrivingSchoolView.vue | 227 | Decent, but data flows could be optimized | Low |
| App.vue | 28 | Unnecessary backend check on mount | Low |

---

## Conclusion

The frontend demonstrates good foundational structure with Vue 3 Composition API and Pinia. However, it suffers from architectural issues around API communication, state management, and data fetching. The main concerns are:

1. **No centralized API client** leading to code duplication and inconsistent error handling
2. **Redundant API calls** causing unnecessary network requests
3. **Poor data caching strategy** resulting in repeated fetches
4. **Oversized components** mixing concerns and reducing maintainability
5. **Weak type safety** with multiple `any` types and untyped API responses

Addressing these issues would significantly improve performance, maintainability, and developer experience.
