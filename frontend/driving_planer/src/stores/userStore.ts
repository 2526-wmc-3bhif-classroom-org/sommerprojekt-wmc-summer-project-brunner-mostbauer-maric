import {defineStore} from "pinia";
import {ref} from "vue";
import {useAuthStore} from "@/stores/authStore.ts";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

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
