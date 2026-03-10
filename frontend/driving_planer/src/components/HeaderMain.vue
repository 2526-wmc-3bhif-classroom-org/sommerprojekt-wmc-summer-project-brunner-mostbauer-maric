<script setup lang="ts">
  const props= defineProps({
    title: {
      type: String,
      required: true
    }
  })
</script>

<template>
  <div class="header align-items-center p-10">
    <Motion
      is="h1"
      class="text-7xl font-black text-black text-center"
      v-motion-pop-visible-once
      :duration="600"
    >{{title}}</Motion>
  </div>

</template>

<style scoped>

</style>
