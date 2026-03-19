<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/stores.js'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

const router = useRouter()
const authStore = useAuthStore()

const userName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  error.value = ''
  loading.value = true
  try {
    await authStore.register({ userName: userName.value, email: email.value, password: password.value })
    router.push('/')
  } catch (e: any) {
    error.value = e.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <Card class="w-full max-w-md p-4">
      <template #title>
        <h2 class="text-center">Register</h2>
      </template>
      <template #content>
        <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label for="userName">User Name</label>
            <InputText id="userName" v-model="userName" required />
          </div>
          <div class="flex flex-col gap-2">
            <label for="email">Email</label>
            <InputText id="email" v-model="email" type="email" required />
          </div>
          <div class="flex flex-col gap-2">
            <label for="password">Password</label>
            <Password id="password" v-model="password" toggle-mask required />
          </div>
          <div class="flex flex-col gap-2">
            <label for="confirmPassword">Confirm Password</label>
            <Password id="confirmPassword" v-model="confirmPassword" :feedback="false" toggle-mask required />
          </div>
          <Message v-if="error" severity="error">{{ error }}</Message>
          <Button type="submit" label="Register" :loading="loading" icon="pi pi-user-plus" />
          <div class="text-center mt-2">
            <span>Already have an account? </span>
            <router-link to="/login" class="text-primary hover:underline font-bold">Login</router-link>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>
