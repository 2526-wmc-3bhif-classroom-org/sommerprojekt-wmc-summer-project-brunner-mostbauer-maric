import {defineStore} from "pinia";
import {computed, ref} from "vue";
import type {AuthResponse, User} from "@/types.ts";
import router from "@/router";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  SCHOOL = "school"
}
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(sessionStorage.getItem('user') || 'null'))
  const token = ref<string | null>(sessionStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.Role === UserRole.ADMIN)
  const isSchool = computed(() => user.value?.Role === UserRole.SCHOOL)
  const isStudent = computed(() => user.value?.Role === UserRole.USER)

  async function login(credentials: { email: string; password: string }, fromRegister: boolean = false) : Promise<UserRole>{
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })

    if (!response.ok) {
      let errorMessage = 'Login failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {
        // Fallback if JSON parsing fails
      }
      throw new Error(errorMessage)
    }

    const data: AuthResponse = await response.json()
    token.value = data.accessToken;
    user.value = data.user

    sessionStorage.setItem('token', data.accessToken)
    sessionStorage.setItem('user', JSON.stringify(data.user))

    // Also update localStorage to match the ref initialization logic
    localStorage.setItem('token', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data.user))

    if(!fromRegister) {
      if(data.user.Role === UserRole.USER) {
        let hasEnrolled = localStorage.getItem(`enrolled_${data.user.UserId}`)
        if (!hasEnrolled) {
          try {
            const enrollRes = await fetch(`${API_URL}/users/${data.user.UserId}/enrollments`, {
              headers: { Authorization: `Bearer ${data.accessToken}` }
            })
            if (enrollRes.ok) {
              const enrollments = await enrollRes.json()
              if (Array.isArray(enrollments) && enrollments.length > 0) {
                const e = enrollments[0]
                const licenseTypeMapping: Record<number, string> = {
                  1: 'A', 2: 'A1', 3: 'A2', 4: 'AM', 5: 'B', 6: 'BE', 7: 'C', 8: 'C1', 9: 'CE', 10: 'D', 11: 'D1', 12: 'DE'
                }
                const joinedCourse = {
                  id: e.LicenseProgramId,
                  drivingSchoolId: e.DrivingSchoolId,
                  licenseType: licenseTypeMapping[e.LicenseTypeId] ?? String(e.LicenseTypeId),
                  dateFrom: e.DateFrom,
                  dateTo: e.DateTo,
                  timeFrom: e.TimeFrom ?? '',
                  timeTo: e.TimeTo ?? '',
                  weekdays: e.Weekdays ? e.Weekdays.split(',') : [],
                  isSchnellkurs: !!e.IsSchnellkurs,
                  price: e.Price,
                  maxParticipants: e.MaxParticipants,
                  currentParticipants: e.CurrentParticipants,
                }
                localStorage.setItem(`enrolled_${data.user.UserId}`, 'true')
                localStorage.setItem(`joinedCourse_${data.user.UserId}`, JSON.stringify(joinedCourse))
                if (e.Goal) localStorage.setItem(`goal_${data.user.UserId}`, e.Goal)
                if (e.PlannerStartDate) localStorage.setItem(`startDate_${data.user.UserId}`, e.PlannerStartDate)
                hasEnrolled = 'true'
              }
            }
          } catch {
            // falls back to /start if check fails
          }
        }
        await router.push(hasEnrolled ? '/dashboard' : '/start')
      } else if(data.user.Role === UserRole.ADMIN) {
        await router.push('/dashboard')
      } else if(data.user.Role === UserRole.SCHOOL){
        await router.push('/manage')
      }
    }
    return data.user.Role as UserRole
  }

  async function register(userData: { userName: string; email: string; password: string; isDrivingSchool: boolean; location?: string; owner?: string; phone?: string; website?: string }) {
    const body: Record<string, unknown> = {
      userName: userData.userName,
      email: userData.email,
      password: userData.password,
      isSchool: userData.isDrivingSchool
    }
    if (userData.isDrivingSchool) {
      body.location = userData.location
      body.owner = userData.owner
      body.phone = userData.phone
      body.website = userData.website
    }
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      let errorMessage = 'Registration failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {
        // Fallback if JSON parsing fails
      }
      throw new Error(errorMessage)
    }

    const role: UserRole = await login({email: userData.email, password: userData.password}, true)
    if(role === UserRole.ADMIN || role === UserRole.USER) {
      await router.push('/start')
    }else if(role === UserRole.SCHOOL) {
      await router.push('/manage')
    }
  }

  function logout() {
    token.value = null
    user.value = null
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  function updateUser(userData: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      sessionStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  return { user, token, isAuthenticated, isAdmin, isSchool, isStudent, login, register, logout, updateUser }
})
