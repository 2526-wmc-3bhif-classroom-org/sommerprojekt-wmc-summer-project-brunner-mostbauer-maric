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
    }
  })
</script>

<template>
  <div class="header align-items-center p-10">
    <Motion
      is="h1"
      :class="['font-black text-black text-center', height]"
      v-motion-pop-visible-once
      :duration="600"
    >{{title}}</Motion>
  </div>

</template>

<style scoped>

</style>
