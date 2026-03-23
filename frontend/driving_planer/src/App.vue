<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from "@/components/Navbar.vue";
import { onMounted } from 'vue';

onMounted(async () => {
  const apiUrl = import.meta.env.VITE_API_URL_CONNECTION_TEST || 'http://localhost:3000';
  try {
    const response = await fetch(`${apiUrl}/`);
    if (!response.ok) {
      throw new Error('Backend responded with an error');
    }else{
      console.log("OK Response from backend")
    }
  } catch (error) {
    console.error('Failed to detect a healthy connection to the backend:', error);
  }
});
</script>

<template>
  <div class="overflow-x-hidden">
  <Navbar>
    <RouterView/>
  </Navbar>
  </div>
</template>

