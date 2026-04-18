import {defineStore} from "pinia";
import {type Ref, ref} from "vue";
import type {DrivingSchool} from "@/types.ts";
import {useAuthStore} from "@/stores/authStore.ts";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const useSchoolStore = defineStore('schools', () => {
  const schools: Ref<DrivingSchool[]> = ref<DrivingSchool[]>([])
  const countOfSchools = ref<number>(0)
  const error = ref<string | null>(null)

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
      error.value = 'Fehler beim Laden der Fahrschulen'
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
  return { schools, countOfSchools, error, fetchSchools, fetchSchoolCount }
})
