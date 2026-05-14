import {defineStore} from "pinia";
import {type Ref, ref} from "vue";
import type {DrivingSchool} from "@/types.ts";
import {useAuthStore} from "@/stores/authStore.ts";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const useSchoolStore = defineStore('schools', () => {
  const schools: Ref<DrivingSchool[]> = ref<DrivingSchool[]>([])
  const ratings = ref<any[]>([])
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
    } catch (e) {
      console.error('Failed to fetch schools count:', e)
    }
    }

    async function fetchRatings() {
    try {
      const response = await fetch(`${API_URL}/ratings`)
      ratings.value = await response.json()
    } catch (e) {
      console.error('Failed to fetch ratings:', e)
    }
    }

    async function setRating(schoolId: number, stars: number) {
      const authStore = useAuthStore()
      if (!authStore.token || !authStore.user) return false

      const userId = authStore.user.UserId
      const existingRating = ratings.value.find(r => r.DrivingSchoolId === schoolId && r.UserId === userId)

      try {
        let response;
        if (stars === 0) {
          response = await fetch(`${API_URL}/ratings/${schoolId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authStore.token}` }
          })
        } else if (existingRating) {
          response = await fetch(`${API_URL}/ratings`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authStore.token}`
            },
            body: JSON.stringify({ schoolId, stars })
          })
        } else {
          response = await fetch(`${API_URL}/ratings`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authStore.token}`
            },
            body: JSON.stringify({ schoolId, stars })
          })
        }

        if (response.ok) {
          await fetchRatings()
          return true
        }
        return false
      } catch (e) {
        console.error('Failed to set rating:', e)
        return false
      }
    }
    return { schools, ratings, countOfSchools, error, fetchSchools, fetchSchoolCount, fetchRatings, setRating }
    })
