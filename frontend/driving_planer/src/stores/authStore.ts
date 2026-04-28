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
        const hasEnrolled = localStorage.getItem(`enrolled_${data.user.UserId}`)
        await router.push(hasEnrolled ? '/dashboard' : '/start')
      } else if(data.user.Role === UserRole.ADMIN) {
        await router.push('/dashboard')
      } else if(data.user.Role === UserRole.SCHOOL){
        await router.push('/manage')
      }
    }
    return data.user.Role as UserRole
  }

  async function register(userData: { userName: string; email: string; password: string; isDrivingSchool: boolean }) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        userName: userData.userName,
        email: userData.email,
        password: userData.password,
        isSchool: userData.isDrivingSchool
      })
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

  return { user, token, isAuthenticated, isAdmin, isSchool, isStudent, login, register, logout }
})
