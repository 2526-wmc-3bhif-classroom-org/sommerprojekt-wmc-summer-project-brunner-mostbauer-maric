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
    }
  })
</script>

<template>
  <div :class="['flex flex-col items-center p-4 gap-1 border-2 rounded-2xl', borderColor]">
    <i :class="[icon, iconColor]" style="font-size: 1.5rem" />
    <h3 class="text-center font-bold m-2 text-lg text-black">{{ title }}</h3>
    <p class="text-center text-sm text-black">{{ description }}</p>
  </div>
</template>

<style scoped>

</style>
