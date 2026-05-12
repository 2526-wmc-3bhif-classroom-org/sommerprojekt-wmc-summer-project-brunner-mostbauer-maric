<script setup lang="ts">
import Background from "@/components/Background.vue"
import FooterCmp from "@/components/FooterCmp.vue"
import HeaderMain from "@/components/HeaderMain.vue"
</script>

<template>
  <Background>
    <section class="flex flex-col items-center justify-center md:py-24 pt-24 pb-10 px-6 text-center">
      <HeaderMain
        title="Impressum"
        desktopHeight="md:text-7xl"
        mobileHeight="text-3xl"
        :duration="400"
      />
      <p class="text-black/50 md:text-xl text-sm mt-4 max-w-2xl">
        Angaben gemäß § 5 ECG (Österreich)
      </p>
    </section>

    <section class="flex flex-col items-center px-6 pb-16">
      <div class="w-full max-w-2xl bg-white rounded-3xl shadow-md p-8 flex flex-col gap-8">

        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2 text-black font-bold text-lg">
            <i class="pi pi-building"></i>
            <span>Unternehmen</span>
          </div>
          <p class="text-black/70">Drivingplaner</p>
          <p class="text-black/70">Limesstraße 12–14</p>
          <p class="text-black/70">4060 Leonding, Österreich</p>
        </div>

        <div class="border-t border-black/10"></div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2 text-black font-bold text-lg">
            <i class="pi pi-users"></i>
            <span>Verantwortliche Personen</span>
          </div>
          <p class="text-black/70">Luka Marić</p>
          <p class="text-black/70">Jan Brunner</p>
          <p class="text-black/70">Julian Mostbauer</p>
        </div>

        <div class="border-t border-black/10"></div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2 text-black font-bold text-lg">
            <i class="pi pi-envelope"></i>
            <span>Kontakt</span>
          </div>
          <p class="text-black/70">E-Mail: contact@drivingplaner.at</p>
          <p class="text-black/70">Telefon: +43 732 67 92 0</p>
        </div>

        <div class="border-t border-black/10"></div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2 text-black font-bold text-lg">
            <i class="pi pi-info-circle"></i>
            <span>Rechtliche Angaben</span>
          </div>
          <p class="text-black/70">UID-Nr.: ATU00000000</p>
          <p class="text-black/70">
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.
            Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
          </p>
        </div>

      </div>
    </section>

    <FooterCmp />
  </Background>
</template>
