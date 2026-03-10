<script setup lang="ts">
  import CardMain from "@/components/CardMain.vue";

  const props = defineProps({
      entries: {
        type: Array as () => ITimelineEntry[],
        required: true
      }
  })

  interface ITimelineEntry {
    title: string;
    description: string;
    borderColor: string;
    icon: string;
    iconColor: string;
    duration: number;
  }
</script>

<template>
  <div class="flex flex-col items-center justify-center p-4 gap-1">
    <div
      v-for="(entry, index) in entries"
        :key="entry.title"
    >
      <CardMain :title="entry.title"
                :description="entry.description"
                :icon="entry.icon"
                :iconColor="entry.iconColor"
                :borderColor="entry.borderColor"
                :duration="entry.duration"
                :max-with="'max-w-md'"
      ></CardMain>
      <div v-if="index < entries.length - 1" class="flex flex-col items-center py-1">
        <div class="w-0.5 bg-black/30 h-10" />
      </div>
    </div>
  </div>
</template>


