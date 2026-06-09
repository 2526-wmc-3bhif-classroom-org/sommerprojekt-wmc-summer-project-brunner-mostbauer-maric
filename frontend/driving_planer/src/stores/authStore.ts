import {defineStore} from "pinia";
import {computed, ref} from "vue";
import type {AuthResponse, User} from '@/types';
import { apiClient } from '@/api/client';
import { cacheManager } from '@/api/cache';
import { enrollmentService } from '@/api/enrollmentService';
import { schoolService } from '@/api/schoolService';

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

  const enrolledStatus = ref<boolean>(
    user.value ? sessionStorage.getItem(`enrolled_${user.value.UserId}`) === 'true' : false
  )
  const isEnrolled = computed(() => enrolledStatus.value)

  function setEnrolled(value: boolean) {
    enrolledStatus.value = value
    if (user.value) {
      sessionStorage.setItem(`enrolled_${user.value.UserId}`, value ? 'true' : 'false')
    }
    if (value) skippedEnrollment.value = false
  }

  const skippedEnrollment = ref<boolean>(
    user.value ? (user.value.HasSkipped === true || sessionStorage.getItem(`skipped_${user.value.UserId}`) === 'true') : false
  )
  const hasSkippedEnrollment = computed(() => skippedEnrollment.value)

  async function setSkippedEnrollment(value: boolean) {
    skippedEnrollment.value = value
    if (user.value) {
      sessionStorage.setItem(`skipped_${user.value.UserId}`, value ? 'true' : 'false')
      if (value) {
        try {
          await apiClient.patch(`/users/${user.value.UserId}/skip`, {}, {})
        } catch {}
      }
    }
  }

  async function login(credentials: { email: string; password: string }, fromRegister: boolean = false) : Promise<UserRole>{
    try {
      const data = await apiClient.post<AuthResponse>('/auth/login', credentials, { skipAuth: true })

      token.value = data.accessToken;
      user.value = data.user

      sessionStorage.setItem('token', data.accessToken)
      sessionStorage.setItem('user', JSON.stringify(data.user))

      if(!fromRegister) {
        // Dynamic import to avoid circular dependency
        const router = (await import('@/router/index')).default
        
        if(data.user.Role === UserRole.USER) {
          const enrolled = await enrollmentService.hasEnrollments(data.user.UserId)
          sessionStorage.setItem(`enrolled_${data.user.UserId}`, enrolled ? 'true' : 'false')
          enrolledStatus.value = enrolled
          const skipped = !!data.user.HasSkipped
          sessionStorage.setItem(`skipped_${data.user.UserId}`, skipped ? 'true' : 'false')
          skippedEnrollment.value = skipped
          await router.push(enrolled ? '/dashboard' : (skipped ? '/dashboard' : '/start'))
        } else if(data.user.Role === UserRole.ADMIN) {
          await router.push('/dashboard')
        } else if(data.user.Role === UserRole.SCHOOL){
          await router.push('/manage')
        }
      }
      return data.user.Role as UserRole
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  async function register(userData: { userName: string; email: string; password: string; isDrivingSchool: boolean; location?: string; owner?: string; phone?: string; website?: string; latitude?: number; longitude?: number }) {
    try {
      const body: Record<string, unknown> = {
        userName: userData.userName,
        email: userData.email,
        password: userData.password,
        isSchool: userData.isDrivingSchool,
        location: userData.location,
        latitude: userData.latitude,
        longitude: userData.longitude
      }
      if (userData.isDrivingSchool) {
        body.owner = userData.owner
        body.phone = userData.phone
        body.website = userData.website
      }

      await apiClient.post('/auth/register', body, { skipAuth: true })

      const role: UserRole = await login({email: userData.email, password: userData.password}, true)
      
      // Dynamic import to avoid circular dependency
      const router = (await import('@/router/index')).default
      
      if(role === UserRole.ADMIN || role === UserRole.USER) {
        await router.push('/start')
      }else if(role === UserRole.SCHOOL) {
        await router.push('/manage')
      }
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  async function logout() {
    const userId = user.value?.UserId
    
    token.value = null
    user.value = null
    enrolledStatus.value = false
    skippedEnrollment.value = false
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    
    // Clear enrollment flag for this user
    if (userId) {
      sessionStorage.removeItem(`enrolled_${userId}`)
    }
    
    // Clear all caches on logout
    cacheManager.clear()
    enrollmentService.invalidateAll()
    schoolService.invalidateAll()
    
    // Dynamic import to avoid circular dependency
    const router = (await import('@/router/index')).default
    await router.push('/login')
  }

  function updateUser(userData: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      sessionStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  return { user, token, isAuthenticated, isAdmin, isSchool, isStudent, isEnrolled, setEnrolled, hasSkippedEnrollment, setSkippedEnrollment, login, register, logout, updateUser }
})
