<template>
  <!-- Main layout container -->
  <div class="flex h-screen bg-transparent font-sans relative">

    <!-- Mobile Top Navbar (visible only on small screens) -->
    <header class="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 py-3 m-3">
      <!-- Button to toggle the sidebar -->
      <button @click="sidebarOpen = !sidebarOpen" class="p-2 text-gray-600 hover:text-black transition-colors" aria-label="Menü öffnen">
        <i :class="'pi pi-bars'" class="text-xl"></i>
      </button>
    </header>

    <!-- Dark overlay behind the sidebar (closes sidebar when clicked) -->
    <div
      v-if="sidebarOpen"
      class="md:hidden fixed inset-0 z-40 bg-black/30"
      @click="sidebarOpen = false"
    />

    <!-- Mobile Sidebar -->
    <aside
      :class="['md:hidden fixed top-0 left-0 h-full bg-white z-9999 shadow-xl transform transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full']"
    >
      <!-- Sidebar header with close button -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button @click="sidebarOpen = false" class="p-2 text-gray-400 hover:text-black" aria-label="Menü schließen">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Navigation links -->
      <nav class="flex flex-col gap-2 p-4">
        <div
          v-for="(link, index) in links"
          :key="index"
          @click="sidebarOpen = false"
        >
          <!-- Custom component for navbar links -->
          <NavbarLinks
            :link-to="link.to"
            :title="link.title"
            :icon="link.icon"
          />
        </div>
      </nav>

      <!-- Bottom section with settings and profile -->
      <div class="absolute bottom-6 left-0 right-0 flex flex-col items-start gap-4 px-4">
        <!-- Settings button -->
        <button class="p-3 text-gray-400 hover:text-black transition-colors"
                v-tooltip="'Einstellungen'"
                aria-label="Einstellungen"
        >
          <i class="pi pi-cog text-lg"></i>
        </button>

        <!-- Profile image which opens the profile menu -->
        <div
          v-tooltip="'Profil'"
          @click="toggleMenu"
          class="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:border-gray-300 transition-all"
          role="button"
          aria-label="Profilmenü öffnen"
        >
          <img src="https://placehold.co/600x400" alt="Benutzerprofil" class="w-full h-full object-cover" />
        </div>

        <!-- PrimeVue popup menu -->
        <Menu ref="menu" id="overlay_menu_mobile" :model="menuItems" :popup="true" />
      </div>
    </aside>

    <!-- Desktop Sidebar (visible only on medium screens and larger) -->
    <aside class="hidden md:flex w-20 flex-col items-center py-6 bg-white border-r border-gray-200 shadow-sm">
      <!-- Navigation links -->
      <nav class="flex flex-col gap-4 flex-1 w-full items-center">
        <NavbarLinks
          v-for="(link, index) in links"
          :key="index"
          :link-to="link.to"
          :title="link.title"
          :icon="link.icon"
        />
      </nav>

      <!-- Bottom section with settings and profile -->
      <div class="flex flex-col gap-6 mt-auto items-center">
        <!-- Settings button -->
        <button class="p-3 text-gray-400 hover:text-black transition-colors"
                v-tooltip="'Einstellungen'"
                aria-label="Einstellungen"
        >
          <i class="pi pi-cog text-lg"></i>
        </button>

        <!-- Profile avatar -->
        <div
          v-tooltip="'Profil'"
          @click="toggleMenu"
          class="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:border-gray-300 transition-all active:scale-95"
          role="button"
          aria-label="Profilmenü öffnen"
        >
          <img src="https://placehold.co/600x400" alt="Benutzerprofil" class="w-full h-full object-cover" />
        </div>

        <!-- PrimeVue popup menu -->
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
import NavbarLinks from './NavbarLinks.vue'
import Menu from 'primevue/menu'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Reference to the scroll container for resetting scroll position
const scrollContainer = ref<HTMLElement | null>(null)

// Reset scroll position when route changes
watch(() => route.path, () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = 0
  }
})

// Reference to the PrimeVue menu component
const menu = ref(null)

// Controls mobile sidebar visibility
const sidebarOpen = ref(false)

// Navigation links used in the sidebar
const links = [
  { to: '/', title: 'Zuhause', icon: 'pi-home' },
  { to: '/about', title: 'Über uns', icon: 'pi-info-circle' },
  { to: '/schools', title: 'Fahrschulen', icon: 'pi-book' },
  { to: '/dashboard', title: 'Dashboard', icon: 'pi-chart-bar' },
  { to: '/manage', title: 'Kursverwaltung', icon: 'pi-building' }
]

// Dynamic menu items depending on login state
const menuItems = computed(() => {
  if (authStore.isAuthenticated) {
    return [
      { label: `Profil (${authStore.user?.UserName})`, icon: 'pi pi-user' },
      { label: 'Logout', icon: 'pi pi-sign-out', command: () => { handleLogout() } }
    ]
  } else {
    return [
      { label: 'Login', icon: 'pi pi-sign-in', command: () => { router.push('/login') } },
      { label: 'Register', icon: 'pi pi-user-plus', command: () => { router.push('/register') } }
    ]
  }
})

// Opens or closes the profile popup menu
const toggleMenu = (event) => {
  menu.value.toggle(event)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
