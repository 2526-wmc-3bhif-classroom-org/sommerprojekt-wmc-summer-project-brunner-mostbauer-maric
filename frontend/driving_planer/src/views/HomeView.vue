<template>
  <HeaderMain title="Driving Planer" />
  <div class="align-items-center m-5 w-full flex flex-auto justify-center pt-12 gap-4">
    <Button class="bg-black text-white text-center text-xl p-6 rounded-3xl m-5"
            v-motion
            :initial="{ opacity: 0, x: -50 }"
            :enter="{opacity: 1, x:0}"
            :duration="1200"
    >
      Jetzt anfangen
    </Button>

    <Button class="bg-white text-black text-center text-xl p-6 m-5 rounded-3xl"
        v-motion
        :initial="{ opacity: 0, x: 50 }"
        :enter="{opacity: 1, x:0}"
        :duration="1200"

    >
      Unsere Vorteile
    </Button>
  </div>
</template>

<script setup>


import HeaderMain from "@/components/HeaderMain.vue";

</script>


