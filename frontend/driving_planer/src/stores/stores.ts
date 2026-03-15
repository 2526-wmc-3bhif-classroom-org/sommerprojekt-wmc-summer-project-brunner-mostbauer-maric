import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type {DrivingSchool} from '../types.ts'

export const useSchoolStore = defineStore('schools',() => {
  const schools = ref<DrivingSchool[]>([])
  const countOfSchools = ref<number>(0);


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
  const countOfTotalUsers = ref<number>(0)

  async function fetchUsersCount() {
    const url: string = "http://localhost:3000/api/users/count"
    const response = await fetch(url);
    const val : {count: number} = await response.json();
    countOfTotalUsers.value = val.count;
  }
  return {countOfTotalUsers, fetchUsersCount};
})
