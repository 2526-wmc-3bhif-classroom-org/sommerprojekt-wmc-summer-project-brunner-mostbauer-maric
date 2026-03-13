<script setup lang="ts">
import HeaderMain from "@/components/HeaderMain.vue";
import CardMain from "@/components/CardMain.vue";

const aboutCards = [
  {
    title: "Unsere Mission",
    description: "Wir wollen es Fahrschülerinnen und Fahrschüler erleichtern ihren Führerschein abzuschließen",
    icon: "pi pi-lightbulb",
    iconColor: "text-black",
    borderColor: "border-black",
    duration: 500,
  }
]
</script>

<template>
  <div class="justify-center flex flex-row items-center py-8">
    <HeaderMain title="Wer sind wir?"
                description="Wir sind ein Team von Fahrlehrern, die es sich zum Ziel gesetzt haben, die Fahrschulausbildung zu revolutionieren. Mit unserer App möchten wir den Lernprozess für Fahrschüler einfacher, effizienter und unterhaltsamer gestalten."
                :duration="400"
                :desktopHeight="'md:text-7xl'"
                :mobileHeight="'text-3xl'"
    />
  </div>

  <div class="flex md:flex-row flex-col justify-center items-center">
    <CardMain
      v-for="card in aboutCards"
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



