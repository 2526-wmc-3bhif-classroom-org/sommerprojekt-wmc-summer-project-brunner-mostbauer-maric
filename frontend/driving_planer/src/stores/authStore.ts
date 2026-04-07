import {defineStore} from "pinia";
import {computed, ref} from "vue";
import type {AuthResponse, User} from "@/types.ts";
import router from "@/router";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.Role === 'admin')

  async function login(credentials: { email: string; password: string }, fromRegister: boolean = false) {
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

    sessionStorage.setItem('token', data.accessToken)
    sessionStorage.setItem('user', JSON.stringify(data.user))
    if(!fromRegister) {
      await router.push('/dashboard');
    }
  }

  async function register(userData: { userName: string; email: string; password: string }) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Registration failed')
    }

    await login({email: userData.email, password: userData.password}, true)
    await router.push('/start')
  }
  function logout() {
    token.value = null
    user.value = null
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  }

  return { user, token, isAuthenticated, isAdmin, login, register, logout }
})
