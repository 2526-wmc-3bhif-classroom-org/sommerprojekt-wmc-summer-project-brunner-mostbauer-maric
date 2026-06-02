<template>
  <div class="flex flex-col gap-4 w-full">
    <h4 class="font-bold text-slate-700 text-sm">Kommentare</h4>
    
    <div v-if="comments.length > 0" class="flex flex-col gap-3">
      <div v-for="comment in comments" :key="comment.RatingId" class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
        <div class="flex justify-between items-center">
          <span class="text-xs font-bold text-slate-500 flex items-center">
            <i class="pi pi-user mr-1"></i> {{ comment.UserName || 'User #' + comment.UserId }}
            <span v-if="comment.UserId === authStore.user?.UserId" class="ml-2 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Du</span>
          </span>
          <span class="text-[10px] text-slate-400">{{ comment.Date ? new Date(comment.Date).toLocaleDateString() : '' }}</span>
        </div>
        <div class="flex gap-0.5 mt-1">
          <i
            v-for="star in 5"
            :key="star"
            class="pi text-[10px]"
            :class="[star <= comment.Stars ? 'pi-star-fill text-yellow-400' : 'pi-star text-slate-200']"
          ></i>
        </div>
        <p class="text-sm text-slate-700 mt-1">{{ comment.Content }}</p>
        <div v-if="comment.UserId === authStore.user?.UserId" class="flex justify-end mt-1 gap-2">
          <button @click.stop="deleteComment" class="text-xs text-red-500 hover:text-red-600 transition-colors">
            <i class="pi pi-trash mr-1"></i> Löschen
          </button>
          <button @click.stop="startEditing(comment.Content || '')" class="text-xs text-blue-500 hover:text-blue-600 transition-colors">
            <i class="pi pi-pencil mr-1"></i> Bearbeiten
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-sm text-slate-400 italic">Noch keine Kommentare vorhanden.</div>
    
    <div v-if="authStore.isAuthenticated && !authStore.isSchool" class="mt-2 relative" @click.stop>
      <textarea
        v-model="commentText"
        @input="errorMessage = ''"
        rows="3"
        class="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none shadow-sm"
        placeholder="Schreibe einen Kommentar..."
      ></textarea>
      <p v-if="errorMessage" class="text-xs text-red-500 mt-1 font-medium"><i class="pi pi-exclamation-circle mr-1"></i>{{ errorMessage }}</p>
      <div class="flex justify-end mt-2 gap-2">
        <button 
          v-if="isEditing" 
          @click.stop="cancelEditing"
          class="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          Abbrechen
        </button>
        <button 
          @click.stop="saveComment"
          :disabled="!commentText.trim()"
          class="px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-blue-500/30"
        >
          {{ isEditing ? 'Aktualisieren' : 'Speichern' }}
        </button>
      </div>
    </div>
    <div v-else-if="!authStore.isAuthenticated" class="text-sm text-blue-500 bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2">
      Bitte melde dich an, um einen Kommentar zu schreiben.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSchoolStore } from "@/stores/schoolStore.ts"
import { useAuthStore } from "@/stores/authStore.ts"

const props = defineProps<{
  schoolId: number
}>()

const schoolStore = useSchoolStore()
const authStore = useAuthStore()

const commentText = ref('')
const isEditing = ref(false)
const errorMessage = ref('')

const userRating = computed(() => {
  const userId = authStore.user?.UserId
  if (!userId) return 0
  const rating = schoolStore.ratings.find(r => r.DrivingSchoolId === props.schoolId && r.UserId === userId)
  return rating?.Stars ?? 0
})

const comments = computed(() => {
  return schoolStore.ratings.filter(r => r.DrivingSchoolId === props.schoolId && r.Content && r.Content.trim().length > 0)
})

function startEditing(content: string) {
  commentText.value = content
  isEditing.value = true
  errorMessage.value = ''
}

function cancelEditing() {
  commentText.value = ''
  isEditing.value = false
  errorMessage.value = ''
}

async function deleteComment() {
  if (!userRating.value || userRating.value === 0) return
  
  if (!window.confirm('Möchtest du diesen Kommentar wirklich löschen?')) {
    return
  }
  
  // Keep the stars, just remove the comment text
  await schoolStore.setRating(props.schoolId, userRating.value, '')
  commentText.value = ''
  isEditing.value = false
  errorMessage.value = ''
}

async function saveComment() {
  if (!commentText.value.trim()) return
  
  if (!userRating.value || userRating.value === 0) {
    errorMessage.value = 'Bitte gib zuerst eine Sterne-Bewertung ab, bevor du einen Kommentar speicherst.'
    return
  }
  
  errorMessage.value = ''
  await schoolStore.setRating(props.schoolId, userRating.value, commentText.value)
  commentText.value = ''
  isEditing.value = false
}
</script>