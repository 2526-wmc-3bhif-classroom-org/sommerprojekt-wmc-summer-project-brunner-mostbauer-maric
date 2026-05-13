<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <footer class="flex justify-center items-center gap-6 py-6 px-5 bg-black">
    <p class="text-white text-sm">© 2026 Driving Planer</p>
    <span class="text-white/30 text-sm">|</span>
    <button
      class="text-white/60 text-sm hover:text-white transition-colors duration-200 cursor-pointer"
      @click="router.push('/impressum')"
    >
      {{ t('footer.impressum') }}
    </button>
  </footer>
</template>
