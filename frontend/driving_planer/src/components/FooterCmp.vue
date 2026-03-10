<script setup lang="ts">
  const links = [
    {to: "/", title: "Zuhause" },
    {to: "/about", title: "Über uns"},
    {to: "/schools", title: "Fahrschulen"},
  ]
</script>

<template>

  <footer class="flex justify-between items-start gap-4 py-8 px-5 bg-black">

    <div class="left gap-4">
      <p class="text-white text-sm">© 2026 Driving Planer</p>
    </div>
    <div class="flex flex-col">
      <a
        v-for="link in links"
        :href="link.to"
        :title="link.title"
        class="text-white text-right text-sm hover:text-blue-200 duration-200 transition-all"
      >
        {{link.title}}
      </a>
    </div>
  </footer>
</template>


