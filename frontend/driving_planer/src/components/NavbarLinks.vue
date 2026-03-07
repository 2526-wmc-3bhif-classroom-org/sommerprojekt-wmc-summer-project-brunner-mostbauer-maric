<script setup lang="ts">

const props = defineProps({
  linkTo: { type: String, required: true },
  title: String,
  icon: { type: String, default: 'pi-home' },
})
</script>

<template>
  <router-link :to="linkTo" v-slot="{ isActive }">
    <button
      v-ripple
      :class="[
        'p-4 rounded-xl transition-all duration-200',
        isActive
          ? 'bg-black text-white shadow-md'
          : 'text-gray-400 hover:bg-gray-100 hover:text-black'
      ]"
      :title="title"
    >
      <i :class="['pi text-lg', icon]"></i>
    </button>
  </router-link>
</template>
