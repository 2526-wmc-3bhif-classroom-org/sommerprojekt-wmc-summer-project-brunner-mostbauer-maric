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
  transform: translateY(-4px);
}

/* Icon container */
.icon-wrap {
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.card:hover .icon-wrap {
  transform: scale(1.3) rotate(12deg);
  background-color: #cbd5e1; /* slate-300 */
}

/* Icon itself */
.card-icon {
  transition: font-size 0.3s ease;
}

.card:hover .card-icon {
  font-size: 1.5rem;
}

/* Title */
.card-title {
  transition: font-size 0.3s ease, color 0.3s ease;
}

.card:hover .card-title {
  font-size: 1.25rem;
  color: #0f172a; /* slate-950 */
}

/* Description */
.card-desc {
  transition: font-size 0.3s ease, color 0.3s ease;
}

.card:hover .card-desc {
  font-size: 0.9375rem;
  color: #334155; /* slate-700 */
}
</style>