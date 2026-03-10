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
    }
  })
</script>

<template>
  <div :class="['flex flex-col items-center justify-center p-4 gap-1 border-2 rounded-2xl transition-all hover:shadow-xl cursor-pointer duration-300 min-h-48', borderColor]"
    v-motion-pop-visible-once
    :duration="duration"
  >
    <i :class="[icon, iconColor]" style="font-size: 2rem" />
    <h3 class="text-center font-bold m-2 text-xl text-black">{{ title }}</h3>
    <p class="text-center text-sm text-black">{{ description }}</p>
  </div>
</template>

<style scoped>

</style>
