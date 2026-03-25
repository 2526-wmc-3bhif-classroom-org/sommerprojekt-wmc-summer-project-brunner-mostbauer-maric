<script setup lang="ts">
  const props= defineProps({
    title: {
      type: String,
      required: true
    },
    desktopHeight: {
      type: String,
      required: false,
      default: 'md:text-xl'
    },
    duration: {
      type: Number,
      required: false,
      default: 600,
    },
    mobileHeight: {
      type: String,
      required: false,
      default: 'text-lg'
    },
    headingType: {
      type: String,
      required: false,
      default: 'h1'
    }
  })
</script>

<template>
  <div class="header align-items-center p-10 z-99 relative">
    <Motion
      :is="headingType"
      :class="['font-black text-black text-center', desktopHeight, mobileHeight]"
      :initial="{opacity: 0, scale: 0.8}"
      :visible-once="{opacity: 1, scale: 1, transition: {duration: duration}}"
    >{{title}}</Motion>
  </div>

</template>

<style scoped>

</style>
