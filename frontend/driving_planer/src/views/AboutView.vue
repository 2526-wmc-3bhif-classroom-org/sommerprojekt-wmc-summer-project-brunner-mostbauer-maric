<script setup lang="ts">
import HeaderMain from "@/components/HeaderMain.vue"
import CardMain from "@/components/CardMain.vue"
import Background from "@/components/Background.vue"
import FooterCmp from "@/components/FooterCmp.vue"

const aboutCards = [
  {
    title: "Unsere Mission",
    description: "Wir wollen es Fahrschülerinnen und Fahrschüler erleichtern ihren Führerschein abzuschließen.",
    icon: "pi pi-lightbulb",
    duration: 400,
    iconColor: "text-yellow-500",
    borderColor: "border-yellow-500",
  },
  {
    title: "Unsere Vision",
    description: "Eine Welt in der jeder einfach und stressfrei seinen Führerschein machen kann.",
    icon: "pi pi-eye",
    duration: 400,
    iconColor: "text-blue-500",
    borderColor: "border-blue-500",
  },
  {
    title: "Unser Team",
    description: "Wir sind ein junges Team aus leidenschaftlichen Entwicklern die selbst Fahrschüler waren/sind.",
    icon: "pi pi-users",
    duration: 400,
    iconColor: "text-violet-500",
    borderColor: "border-violet-500",
  },
  {
    title: "Unsere Werte",
    description: "Einfachheit, Transparenz und Qualität stehen bei uns an erster Stelle.",
    icon: "pi pi-heart",
    duration: 400,
    iconColor: "text-pink-500",
    borderColor: "border-pink-500",
  },
]


</script>

<template>
  <Background>

    <section class="flex flex-col items-center justify-center md:py-24 pt-24 pb-10 px-6 text-center">
      <HeaderMain
        title="Wer sind wir?"
        desktopHeight="md:text-7xl"
        mobileHeight="text-3xl"
        :duration="400"
      />
      <p class="text-black/50 md:text-xl text-sm mt-4 max-w-2xl">
        Wir sind ein Team von leidenschaftlichen Entwicklern, die es sich zum Ziel gesetzt haben,
        die Fahrschulausbildung zu revolutionieren.
      </p>
    </section>

    <!-- Cards -->
    <section class="py-4 px-6">
      <HeaderMain title="Was uns antreibt" desktopHeight="md:text-5xl" mobileHeight="text-2xl" :duration="400" />
      <div class="flex justify-center items-center flex-wrap gap-6 py-10 grid grid-cols-1 md:grid-cols-2">
        <CardMain
          v-for="card in aboutCards"
          :key="card.title"
          :title="card.title"
          :description="card.description"
          :icon="card.icon"
          :duration="card.duration"
          :iconColor="card.iconColor"
          :borderColor="card.borderColor"
          class="w-full"
        />
      </div>
    </section>




    <section class="flex flex-col items-center py-8 gap-6 text-center px-6">
      <HeaderMain title="Mach mit!" desktopHeight="md:text-5xl" mobileHeight="text-2xl" :duration="400" />
      <p class="text-black/50 md:text-xl text-sm max-w-xl">
        Starte jetzt und erlebe wie einfach der Weg zum Führerschein sein kann.
      </p>
      <button
        class="bg-black text-white text-xl p-6 rounded-3xl cursor-pointer transition-transform duration-300 hover:-rotate-2"
        @click="$router.push('/register')"
      >
        Jetzt starten
      </button>
    </section>
    <div class="mt-auto">
      <FooterCmp />
    </div>
  </Background>
</template>
