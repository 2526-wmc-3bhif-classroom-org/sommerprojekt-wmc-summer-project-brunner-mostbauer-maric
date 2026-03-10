<template>

  <HeaderMain title="Fahrschulplaner" height="text-7xl" class="py-18" duration="500"/>
  <div class="align-items-center m-5 w-full flex flex-auto justify-center py-12 gap-4">
    <Button class="bg-black text-white text-center text-xl p-6 rounded-3xl m-5 cursor-pointer hover:bg-white hover:text-black transition-colors duration-400"
            v-motion
            :initial="{ opacity: 0, x: -50 }"
            :visible-once="{ opacity: 1, x: 0, transition: { duration: 900, ease: 'linear' }}"
            @click="scrollTo('start-now')"
    >
      Jetzt anfangen
    </Button>

    <Button class="bg-white text-black text-center text-xl p-6 m-5 rounded-3xl cursor-pointer hover:bg-black hover:text-white transition-colors duration-400"
            v-motion
            :initial="{ opacity: 0, x: 50 }"
            :visible-once="{ opacity: 1, x: 0, transition: { duration: 900, ease: 'linear' }}"
            @click="scrollTo('advantages')"
    >
      Unsere Vorteile
    </Button>
  </div>
  <div id="advantages">
    <HeaderMain title="Unsere Vorteile" height="text-5xl" duration="500"></HeaderMain>
  </div>
  <div class="flex justify-center py-16 gap-4 px-6">
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

  <div id="start-now">
    <HeaderMain title="Bereit loszulegen?" height="text-5xl" duration="500"></HeaderMain>
  </div>

  <Timeline :entries="timeLineInputQuickStart"/>

  <FooterCmp></FooterCmp>
</template>

<script setup>


import HeaderMain from "@/components/HeaderMain.vue";
import CardMain from "@/components/CardMain.vue";
import FooterCmp from "@/components/FooterCmp.vue";
import Timeline from "@/components/Timeline.vue";
function scrollTo(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' })
}


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


const timeLineInputQuickStart = [
  {
    title: "Anmeldung",
    description: "Registrieren Sie sich auf unserer Plattform und erstellen Sie Ihr Profil.",
    icon: "pi pi-user-plus",
    duration: 400,
    iconColor: "text-blue-500",
    borderColor: "border-blue-500",
  },
  {
    title: "Fahrschule auswählen",
    description: "Wählen Sie Ihre Fahrschule aus unserer umfangreichen Liste aus.",
    icon: "pi pi-book",
    duration: 400,
    iconColor: "text-violet-500",
    borderColor: "border-violet-500",
  },
  {
    title: "Fahrplan erhalten",
    description: "Erhalten Sie Ihren maßgeschneiderten Fahrplan und starten Sie Ihre Vorbereitung auf den Führerschein.",
    icon: "pi pi-check",
    duration: 400,
    iconColor: "text-emerald-500",
    borderColor: "border-emerald-500",
  },
  {
    title: "Plan durchführen",
    description: "Folgen Sie Ihrem Fahrplan, um sich optimal auf die theoretische und praktische Prüfung vorzubereiten.",
    icon: "pi pi-directions",
    duration: 400,
    iconColor: "text-yellow-500",
    borderColor: "border-yellow-500",
  },
  {
    title: "Erfolg feiern",
    description: "Bestehen Sie Ihre Prüfungen und feiern Sie Ihren Erfolg mit Familie und Freunden!",
    icon: "pi pi-star",
    duration: 400,
    iconColor: "text-pink-500",
    borderColor: "border-pink-500",
  }
]
</script>




