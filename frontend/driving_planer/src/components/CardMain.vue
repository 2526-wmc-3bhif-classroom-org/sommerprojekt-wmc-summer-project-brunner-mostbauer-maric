<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false,
      default: ''
    },
    icon: {
      type: String,
      required: false,
      default: ''
    },
    iconColor: {
      type: String,
      required: false,
      default: 'text-black'
    },
    borderColor: {
      type: String,
      required: false,
      default: 'border-black'
    },
    duration: {
      type: Number,
      required: false,
      default: 1000
    },
    maxWith: {
      type: String,
      required: false,
      default: 'w-full'
    },
    headingType: {
      type: String,
      required: false,
      default: 'h3'
    }
  })
</script>

<template>
  <div class="hover:scale-105 transition-all duration-200">
  <div :class="['flex flex-col items-center justify-center p-4 gap-1 border-2 rounded-2xl cursor-pointer duration-300 min-h-48 relative z-10 bg-white', borderColor, maxWith]"
    v-motion-pop-visible-once
    :duration="duration"
  >
    <i :class="[icon, iconColor]" style="font-size: 2rem" />
    <component :is="headingType" class="text-center font-bold m-2 text-xl text-black">{{ title }}</component>
    <p class="text-center text-sm text-black">{{ description }}</p>
  </div>
  </div>
</template>

<style scoped>

</style>
