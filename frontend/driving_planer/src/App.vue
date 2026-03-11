<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from "@/components/Navbar.vue";

</script>

<template>
  <div class="overflow-x-hidden">
  <Navbar>
    <RouterView/>
  </Navbar>
  </div>
</template>

