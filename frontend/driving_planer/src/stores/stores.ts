import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type {DrivingSchool} from '../types.ts'

export const useSchoolStore = defineStore('schools',() => {
  const schools = ref<DrivingSchool[]>([])
  const countOfSchools = ref(0);


  async function fetchSchools() {
    const url: string = "http://localhost:3000/api/schools"
    try {
      const response = await fetch(url);
      const fetchedSchools: DrivingSchool[] = await response.json();
      schools.value = fetchedSchools;
      countOfSchools.value = fetchedSchools.length;
    }catch (e) {
        console.error("Failed to fetch schools:", e);
    }
  }
  return {schools, countOfSchools, fetchSchools} ;
})

export const useUserStore = defineStore('users',()=> {
  const countOfTotalUsers = ref<{count: number}>()

  async function fetchUsersCount() {
    const url: string = "http://localhost:3000/api/users"
    const response = await fetch(url);
    countOfTotalUsers.value = await response.json();
  }
  return {countOfTotalUsers, fetchUsersCount};
})
