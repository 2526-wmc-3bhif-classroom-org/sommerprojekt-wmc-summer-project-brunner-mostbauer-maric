<script setup lang="ts">
import CountUp from "vue-countup-v3"
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps({
  textColor: { type: String, default: "text-black/50" },
  borderColor: { type: String, default: "border-black" },
  description: { type: String, required: true },
  duration: { type: Number, default: 100 },
  backgroundColor: { type: String, default: "bg-black" },
  endValue: { type: Number, required: true },
  suffix: { type: String, default: "" }
})

const container = ref(null)
const isVisible = ref(false)

useIntersectionObserver(container, (entries) => {
  const entry = entries[0]
  if(entry?.isIntersecting) isVisible.value = true
})
</script>

<template>
  <div class="hover:scale-105 transition-all duration-300">
    <div
      ref="container"
      :class="['flex flex-col items-center justify-center p-4 gap-1 border-4 rounded-2xl min-h-40 min-w-60', borderColor, backgroundColor]"
      v-motion-pop-visible-once
      :duration="duration"
    >
      <div class="flex-row flex">
        <CountUp
          v-if="isVisible"
          :end-val="endValue"
          :duration="2"
          :autoplay="true"
          class="text-5xl text-white font-black"
        />
        <span v-else class="text-5xl text-white font-black">0</span>
        <span class="text-5xl text-white font-black">{{ suffix }}</span>
      </div>
      <p :class="['text-center text-lg', textColor]">{{ description }}</p>
    </div>
  </div>
</template>
