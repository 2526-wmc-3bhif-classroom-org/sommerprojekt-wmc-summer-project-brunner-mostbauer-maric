<template>
  <div class="flex h-screen bg-transparent font-sans relative">

    <!-- Mobile Top Navbar -->
    <header class="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 py-3 m-3">
      <button @click="sidebarOpen = !sidebarOpen" class="p-2 text-gray-600 hover:text-black transition-colors" :aria-label="t('nav.openMenu')">
        <i :class="'pi pi-bars'" class="text-xl"></i>
      </button>
      <span class="font-black text-sm uppercase tracking-widest text-black">Driving Planer</span>
      <div class="w-9"></div>
    </header>

    <!-- Dark overlay -->
    <div
      v-if="sidebarOpen"
      class="md:hidden fixed inset-0 z-40 bg-black/30"
      @click="sidebarOpen = false"
    />

    <!-- Mobile Sidebar -->
    <aside
      :class="['md:hidden fixed top-0 left-0 h-full w-20 bg-white z-9999 shadow-xl transform transition-transform duration-300 flex flex-col items-center',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full']"
    >
      <div class="flex items-center justify-center px-4 py-3 border-b border-gray-200 w-full">
        <button @click="sidebarOpen = false" class="p-2 text-gray-400 hover:text-black" :aria-label="t('nav.closeMenu')">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <nav class="flex flex-col items-center gap-2 p-4 w-full">
        <div
          v-for="(link, index) in links"
          :key="index"
          @click="sidebarOpen = false"
        >
          <NavbarLinks
            :link-to="link.to"
            :title="link.title"
            :icon="link.icon"
          />
        </div>
      </nav>

      <div class="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-4 px-4">
        <!-- Language selector -->
        <div class="relative">
          <button
            @click="langMenuOpen = !langMenuOpen"
            class="p-3 text-gray-400 hover:text-black transition-colors"
            :aria-label="t('nav.language')"
          >
            <i class="pi pi-language text-lg"></i>
          </button>
          <div v-if="langMenuOpen" class="absolute bottom-12 left-0 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 min-w-[80px]">
            <button
              @click="setLocale('de')"
              class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold hover:bg-gray-50 transition-colors w-full"
              :class="locale === 'de' ? 'text-black' : 'text-gray-400'"
            >
              🇩🇪 DE
            </button>
            <button
              @click="setLocale('en')"
              class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold hover:bg-gray-50 transition-colors w-full"
              :class="locale === 'en' ? 'text-black' : 'text-gray-400'"
            >
              🇬🇧 EN
            </button>
          </div>
        </div>

        <div
          v-tooltip="t('nav.openProfile')"
          @click="toggleMenu"
          class="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:border-gray-300 transition-all"
          role="button"
          :aria-label="t('nav.openProfile')"
        >
          <img v-if="authStore.user?.AvatarPath" :src="avatarUrl" alt="User Avatar" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full bg-slate-100 flex items-center justify-center">
              <i class="pi pi-user text-slate-400 text-sm"></i>
          </div>
        </div>

        <Menu ref="menu" id="overlay_menu_mobile" :model="menuItems" :popup="true" />
      </div>
    </aside>

    <!-- Desktop Sidebar -->
    <aside class="hidden md:flex w-20 flex-col items-center py-6 bg-white border-r border-gray-200 shadow-sm">
      <nav class="flex flex-col gap-4 flex-1 w-full items-center">
        <NavbarLinks
          v-for="(link, index) in links"
          :key="index"
          :link-to="link.to"
          :title="link.title"
          :icon="link.icon"
        />
      </nav>

      <div class="flex flex-col gap-6 mt-auto items-center">
        <!-- Language selector -->
        <div class="relative">
          <button
            @click="langMenuOpen = !langMenuOpen"
            class="p-3 text-gray-400 hover:text-black transition-colors"
            :aria-label="t('nav.language')"
          >
            <i class="pi pi-language text-lg"></i>
          </button>
          <div v-if="langMenuOpen" class="absolute bottom-12 left-0 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 min-w-[80px]">
            <button
              @click="setLocale('de')"
              class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold hover:bg-gray-50 transition-colors w-full"
              :class="locale === 'de' ? 'text-black' : 'text-gray-400'"
            >
              🇩🇪 DE
            </button>
            <button
              @click="setLocale('en')"
              class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold hover:bg-gray-50 transition-colors w-full"
              :class="locale === 'en' ? 'text-black' : 'text-gray-400'"
            >
              🇬🇧 EN
            </button>
          </div>
        </div>

        <div
          v-tooltip="t('nav.openProfile')"
          @click="toggleMenu"
          class="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:border-gray-300 transition-all active:scale-95"
          role="button"
          :aria-label="t('nav.openProfile')"
        >
          <img v-if="authStore.user?.AvatarPath" :src="avatarUrl" alt="User Avatar" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full bg-slate-100 flex items-center justify-center">
              <i class="pi pi-user text-slate-400 text-sm"></i>
          </div>
        </div>

        <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />
      </div>
    </aside>

    <!-- Main Content Area -->
    <main ref="scrollContainer" class="flex-1 overflow-y-auto md:mt-0 mt-14">
      <div class="max-w-full mx-auto">
        <router-view />
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.ts'
import { useI18n } from 'vue-i18n'
import NavbarLinks from './NavbarLinks.vue'
import Menu from 'primevue/menu'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { t, locale } = useI18n()

const langMenuOpen = ref(false)

const setLocale = (lang: string) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
  langMenuOpen.value = false
}

const avatarUrl = computed(() => {
  if (authStore.user?.AvatarPath) {
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '')
    const path = authStore.user.AvatarPath.startsWith('avatars/')
      ? authStore.user.AvatarPath
      : `avatars/${authStore.user.AvatarPath}`
    return `${baseUrl}/${path}`
  }
  return ''
})

const scrollContainer = ref<HTMLElement | null>(null)

watch(() => route.path, () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = 0
  }
  langMenuOpen.value = false
})

const menu = ref<InstanceType<typeof Menu> | null>(null)
const sidebarOpen = ref(false)

const links = computed(() => {
   const allLinks = [
     { to: '/',          title: t('nav.home'),       icon: 'pi-home',        show: true },
     { to: '/about',     title: t('nav.about'),      icon: 'pi-info-circle', show: true },
     { to: '/contact',   title: t('nav.contact'),    icon: 'pi-envelope',    show: true },
     { to: '/schools',   title: t('nav.schools'),    icon: 'pi-book',            show: authStore.isAdmin || authStore.isSchool || authStore.isStudent },
     { to: '/dashboard', title: t('nav.dashboard'),  icon: 'pi-chart-bar',       show: authStore.isAdmin || (authStore.isStudent && (authStore.isEnrolled || authStore.hasSkippedEnrollment)) },
     { to: '/manage',    title: t('nav.manage'),     icon: 'pi-building',        show: authStore.isAdmin || authStore.isSchool },
     { to: '/start',     title: t('nav.startForm'),  icon: 'pi-map',             show: authStore.isStudent && !authStore.isEnrolled && !authStore.hasSkippedEnrollment },
     { to: '/manage',    title: t('nav.joinCourse'), icon: 'pi-graduation-cap',  show: authStore.isStudent && !authStore.isEnrolled && authStore.hasSkippedEnrollment },
   ]
   return allLinks.filter(link => link.show)
 })

const menuItems = computed(() => {
   if (authStore.isAuthenticated) {
     return [
       { label: t('nav.profile', { name: authStore.user?.UserName }), icon: 'pi pi-user', command: () => { router.push('/profile') } },
       { label: t('nav.logout'), icon: 'pi pi-sign-out', command: () => { handleLogout() } }
     ]
   } else {
     return [
       { label: t('nav.login'), icon: 'pi pi-sign-in', command: () => { router.push('/login') } },
       { label: t('nav.register'), icon: 'pi pi-user-plus', command: () => { router.push('/register') } }
     ]
   }
 })

const toggleMenu = (event: Event) => {
   if (menu.value) {
     menu.value.toggle(event)
   }
 }

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
