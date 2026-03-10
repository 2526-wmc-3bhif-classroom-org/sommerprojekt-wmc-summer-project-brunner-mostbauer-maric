<script setup lang="ts">
  const links = [
    {to: "/", title: "Zuhause" },
    {to: "/about", title: "Über uns"},
    {to: "/schools", title: "Fahrschulen"},
  ]
</script>

<template>
  <hr class="border-l border-black h-full z-99 relative">
  <footer class="flex justify-between items-start gap-4 py-8 z-99">

    <div class="left gap-4">
      <p class="text-black">© 2026 Driving Planer</p>
    </div>
    <div class="flex flex-col">
      <a
        v-for="link in links"
        :href="link.to"
        :title="link.title"
        class="text-black text-right"
      >
        {{link.title}}
      </a>
    </div>
  </footer>
</template>


