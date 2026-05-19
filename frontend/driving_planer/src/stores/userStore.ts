import {defineStore} from "pinia";
import {ref} from "vue";
import { apiClient } from '@/api/client';
import { cacheManager } from '@/api/cache';

class UserDataService {
  private userCountCacheKey = 'users:count'
  private userCountCacheTTL = 10 * 60 * 1000 // 10 minutes

  async fetchUsersCount(force = false): Promise<number> {
    if (!force && cacheManager.has(this.userCountCacheKey)) {
      return cacheManager.get<number>(this.userCountCacheKey) || 0
    }

    const response = await apiClient.get<{ count: number }>('/users/count')
    const count = response.count
    cacheManager.set(this.userCountCacheKey, count, this.userCountCacheTTL)
    return count
  }

  invalidate(): void {
    cacheManager.invalidate(this.userCountCacheKey)
  }
}

const userService = new UserDataService()

export const useUserStore = defineStore('users', () => {
  const countOfTotalUsers = ref<number>(0)
  const isLoadingCount = ref(false)

  async function fetchUsersCount(force = false) {
    isLoadingCount.value = true
    try {
      countOfTotalUsers.value = await userService.fetchUsersCount(force)
    } catch (e) {
      console.error('Failed to fetch users count:', e)
    } finally {
      isLoadingCount.value = false
    }
  }

  return { countOfTotalUsers, isLoadingCount, fetchUsersCount }
})
