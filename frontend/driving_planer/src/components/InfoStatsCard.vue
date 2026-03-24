<template>
  <div
    class="w-full h-28 rounded-2xl border flex items-center gap-4 px-4 transition-all duration-300 hover:-translate-y-1"
    :class="borderColor"
  >
    <!-- Icon -->
    <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50">
      <i :class="[icon, iconColor, 'text-lg']"></i>
    </div>

    <!-- Text -->
    <div>
      <p class="text-lg font-bold text-slate-900">{{ title }}</p>
      <p class="text-sm text-slate-500">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon: string
  iconColor: string
  borderColor: string
}>()
</script>