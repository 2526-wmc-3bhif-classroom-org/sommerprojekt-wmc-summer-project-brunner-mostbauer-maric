<template>
  <tr
    class="group border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer"
    @click="openLink"
  >
    <!-- Index -->
    <td class="px-6 py-4 w-12">
      <span class="text-xs font-bold text-slate-300">{{ index + 1 }}</span>
    </td>

    <!-- Fahrschule -->
    <td class="px-6 py-4">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
          <i class="pi pi-car text-blue-500 text-sm"></i>
        </div>
        <span class="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{{ school.name }}</span>
      </div>
    </td>

    <!-- Ort -->
    <td class="px-6 py-4">
      <div class="flex items-center gap-2 text-sm text-slate-500">
        <i class="pi pi-map-marker text-slate-300 text-xs"></i>
        {{ school.ort }}
      </div>
    </td>

    <!-- Inhaber -->
    <td class="px-6 py-4">
      <div class="flex items-center gap-2 text-sm text-slate-600">
        <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
          <i class="pi pi-user text-slate-400 text-xs"></i>
        </div>
        {{ school.inhaber }}
      </div>
    </td>

    <!-- Aktion -->
    <td class="px-6 py-4 text-right">
      <a
        :href="school.link"
        target="_blank"
        @click.stop
        class="inline-flex items-center gap-1.5 bg-white hover:bg-blue-600 text-slate-600 hover:text-white text-xs font-bold py-2 px-4 rounded-xl transition-all duration-200 border border-gray-200 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/20"
      >
        Website
        <i class="pi pi-external-link text-xs"></i>
      </a>
    </td>
  </tr>
</template>

<script setup lang="ts">
interface Fahrschule {
  name: string
  ort: string
  inhaber: string
  email: string
  link: string
}

const props = defineProps<{
  school: Fahrschule
  index: number
}>()

function openLink() {
  if (props.school.link) {
    window.open(props.school.link, '_blank')
  }
}
</script>
