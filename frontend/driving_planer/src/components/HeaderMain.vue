<script setup lang="ts">
  const props= defineProps({
    title: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: false,
      default: 'text-xl'
    },
    duration: {
      type: Number,
      required: false,
      default: 600,
    }
  })
</script>

<template>
  <div class="header align-items-center p-10">
    <Motion
      is="h1"
      :class="['font-black text-black text-center', height]"
      :initial="{opacity: 0, scale: 0.8}"
      :enter="{opacity: 1, scale: 1, transition: {duration: duration}}"
    >{{title}}</Motion>
  </div>

</template>

<style scoped>

</style>
