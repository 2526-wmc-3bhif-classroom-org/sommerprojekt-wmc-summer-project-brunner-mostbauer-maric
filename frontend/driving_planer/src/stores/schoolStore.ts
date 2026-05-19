import {defineStore} from "pinia";
import {computed, ref} from "vue";
import type {DrivingSchool, Rating} from "@/types.js";
import { schoolService } from "@/api/schoolService.js";

export const useSchoolStore = defineStore('schools', () => {
  const schools = ref<DrivingSchool[]>([])
  const ratings = ref<Rating[]>([])
  const countOfSchools = ref<number>(0)
  const error = ref<string | null>(null)
  const isLoadingSchools = ref(false)
  const isLoadingRatings = ref(false)

  const schoolsMap = computed(() => {
    const map = new Map<number, DrivingSchool>()
    schools.value.forEach(school => {
      map.set(school.DrivingSchoolId, school)
    })
    return map
  })

  async function fetchSchools(force = false) {
    isLoadingSchools.value = true
    error.value = null
    try {
      schools.value = await schoolService.fetchSchools(force)
    } catch (e) {
      error.value = 'Fehler beim Laden der Fahrschulen'
      console.error('Failed to fetch schools:', e)
    } finally {
      isLoadingSchools.value = false
    }
  }

  async function fetchSchoolCount(force = false) {
    isLoadingSchools.value = true
    error.value = null
    try {
      countOfSchools.value = await schoolService.fetchSchoolCount(force)
    } catch (e) {
      error.value = 'Fehler beim Laden der Schulanzahl'
      console.error('Failed to fetch schools count:', e)
    } finally {
      isLoadingSchools.value = false
    }
  }

  async function fetchRatings(force = false) {
    isLoadingRatings.value = true
    try {
      ratings.value = await schoolService.fetchRatings(force)
    } catch (e) {
      console.error('Failed to fetch ratings:', e)
    } finally {
      isLoadingRatings.value = false
    }
  }

  async function setRating(schoolId: number, stars: number): Promise<boolean> {
    try {
      const success = await schoolService.setRating(schoolId, stars)
      if (success) {
        // Refresh ratings after update
        await fetchRatings(true)
      }
      return success
    } catch (e) {
      console.error('Failed to set rating:', e)
      return false
    }
  }

  function getSchoolById(id: number): DrivingSchool | undefined {
    return schoolsMap.value.get(id)
  }

  function getSchoolRatings(schoolId: number): Rating[] {
    return ratings.value.filter(r => r.DrivingSchoolId === schoolId)
  }

  return { 
    schools, 
    ratings, 
    countOfSchools, 
    error,
    isLoadingSchools,
    isLoadingRatings,
    schoolsMap,
    fetchSchools, 
    fetchSchoolCount, 
    fetchRatings, 
    setRating,
    getSchoolById,
    getSchoolRatings
  }
})
