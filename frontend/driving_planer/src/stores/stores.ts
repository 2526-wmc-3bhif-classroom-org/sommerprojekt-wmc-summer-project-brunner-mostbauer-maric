import {computed, ref} from 'vue'
import {defineStore} from 'pinia'
import type {AuthResponse, DrivingSchool, User} from '../types.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.Role === 'admin')

  async function login(credentials: { email: string; password: string }) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Login failed')
    }

    const data: AuthResponse = await response.json()
    token.value = data.accessToken;
    user.value = data.user

    localStorage.setItem('token', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  async function register(userData: { userName: string; email: string; password: string }) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Registration failed')
    }

    const data: AuthResponse = await response.json()
    token.value = data.accessToken
    user.value = data.user

    localStorage.setItem('token', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { user, token, isAuthenticated, isAdmin, login, register, logout }
})

export const useSchoolStore = defineStore('schools', () => {
  const schools = ref<DrivingSchool[]>([])
  const countOfSchools = ref<number>(0)

  async function fetchSchools() {
    const authStore = useAuthStore()
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }

    try {
      const response = await fetch(`${API_URL}/schools`, { headers })
      if (response.status === 401) {
        authStore.logout()
        return
      }
      schools.value = await response.json()
    } catch (e) {
      console.error('Failed to fetch schools:', e)
    }
  }

  async function fetchSchoolCount() {
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    try {
      const response: Response = await fetch(`${API_URL}/schools/count`, {headers});
      const count : {count: number} = await response.json();
      countOfSchools.value = count.count;
    }catch (e) {
      console.error('Failed to fetch schools count:', e)
    }
  }
  return { schools, countOfSchools, fetchSchools, fetchSchoolCount }
})

export const useUserStore = defineStore('users', () => {
  const countOfTotalUsers = ref<number>(0)

  async function fetchUsersCount() {
    const authStore = useAuthStore()
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }

    try {
      const response = await fetch(`${API_URL}/users/count`, { headers })
      if (response.status === 401) {
        authStore.logout()
        return
      }
      const val: { count: number } = await response.json()
      countOfTotalUsers.value = val.count
    } catch (e) {
      console.error('Failed to fetch users count:', e)
    }
  }
  return { countOfTotalUsers, fetchUsersCount }
})
