<template>
  <div
  v-motion
  :initial="{ opacity: 0, x: -40 }"
  :visible-once="{
    opacity: 1,
    x: 0,
    transition: {
      duration: 400,
      delay: Math.min(index * 100, 300)
    }
  }"
  class="card w-full h-28 rounded-2xl border flex items-center gap-4 px-4 bg-white"
  :class="borderColor"
>
    <!-- Icon -->
    <div class="icon-wrap w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50">
      <i :class="[icon, iconColor, 'text-lg', 'card-icon']"></i>
    </div>

    <!-- Text -->
    <div>
      <p class="card-title text-lg font-bold text-slate-900">{{ title }}</p>
      <p class="card-desc text-sm text-slate-500">{{ description }}</p>
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
  index: number
}>()
</script>

<style scoped>
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px) scale(1.10);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

/* Icon container */
.icon-wrap {
  transition: background-color 0.3s ease;
}

.card:hover .icon-wrap {
  background-color: #e2e8f0; /* slate-200 */
}

/* Text and Icon colors */
.card-title, .card-desc, .card-icon {
  transition: color 0.3s ease;
}

.card:hover .card-title {
  color: #0f172a; /* slate-950 */
}

.card:hover .card-desc {
  color: #334155; /* slate-700 */
}
</style>