<script setup lang="ts">
  import CountUp from "vue-countup-v3";

  const props = defineProps({

    textColor: {
      type: String,
      required: false,
      default: "text-black/50"
    },
    borderColor: {
      type: String,
      required: false,
      default: "border-black"
    },
    description: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: false,
      default: 100
    },
    backgroundColor: {
      type: String,
      required: false,
      default: "bg-black"
    },
    endValue: {
      type: Number,
      required: true
    },
    suffix: {
      type: String,
      required: false,
      default: ""
    }
  })
</script>

<template>
  <div class="hover:scale-105 transition-all duration-300">
  <div :class="['flex flex-col items-center justify-center p-4 gap-1 border-4 rounded-2xl min-h-40 min-w-60', borderColor, backgroundColor]"
    v-motion-pop-visible-once
    :duration="duration"
  >
    <div class="flex-row flex">
      <CountUp :end-val="endValue" :duration="2" class="text-5xl text-white
            font-black"/><span class="text-5xl text-white font-black">{{suffix}}</span>
    </div>

    <p :class="['text-center text-lg', textColor]">{{description}}</p>

  </div>
  </div>
</template>

<style scoped>

</style>
