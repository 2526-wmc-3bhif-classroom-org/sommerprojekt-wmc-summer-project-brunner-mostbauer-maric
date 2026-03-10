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
  <div class="flex justify-center pt-16 gap-4">
    <CardMain
      v-for="card in pros"
      :key="card.title"
      :title="card.title"
      :description="card.description"
      :icon="card.icon"
    />
  </div>
</template>

<script setup>


import HeaderMain from "@/components/HeaderMain.vue";
import CardMain from "@/components/CardMain.vue";

const pros = [
  {
    title: "Individuell",
    description: "Erstellen Sie Ihren persönlichen Fahrplan, der auf Ihre Bedürfnisse zugeschnitten ist.",
    icon: "pi pi-user"
  },
  {
    title: "Effizient",
    description: "Optimieren Sie Ihren Lernprozess mit unserem intelligenten Planungsalgorithmus.",
    icon: "pi pi-cog"
  },
  {
    title: "Motivierend",
    description: "Verfolgen Sie Ihren Fortschritt und bleiben Sie motiviert auf dem Weg zum Führerschein.",
    icon: "pi pi-chart-line"
  }
]
</script>


