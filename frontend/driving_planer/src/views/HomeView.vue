<template>
  <HeaderMain title="Driving Planer"  class="py-12"/>
  <div class="align-items-center m-5 w-full flex flex-auto justify-center py-12 gap-4">
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
      :duration="card.duration"
      :iconColor="card.iconColor"
      :borderColor="card.borderColor"
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
    icon: "pi pi-user",
    duration: 500,
    iconColor: "text-blue-500",
    borderColor: "border-blue-500",
  },
  {
    title: "Effizient",
    description: "Optimieren Sie Ihren Lernprozess mit unserem intelligenten Planungsalgorithmus.",
    icon: "pi pi-cog",
    duration: 700,
    iconColor: "text-violet-500",
    borderColor: "border-violet-500",
  },
  {
    title: "Motivierend",
    description: "Verfolgen Sie Ihren Fortschritt und bleiben Sie motiviert auf dem Weg zum Führerschein.",
    icon: "pi pi-chart-line",
    duration: 900,
    iconColor: "text-emerald-500",
    borderColor: "border-emerald-500",
  }
]
</script>


