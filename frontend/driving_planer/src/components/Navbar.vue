<template>
  <div class="flex h-screen bg-transparent font-sans relative">

    <!-- Mobile Top Navbar -->
    <header class="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 py-3 m-3">
      <button @click="sidebarOpen = !sidebarOpen" class="p-2 text-gray-600 hover:text-black transition-colors">
        <i :class="'pi pi-bars'" class="text-xl"></i>
      </button>
    </header>

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="sidebarOpen"
      class="md:hidden fixed inset-0 z-40 bg-black/30"
      @click="sidebarOpen = false"
    />

    <!-- Mobile Sidebar -->
    <aside
      :class="['md:hidden fixed top-0 left-0 h-full bg-white z-50 shadow-xl transform transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full']"
    >
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button @click="sidebarOpen = false" class="p-2 text-gray-400 hover:text-black">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <nav class="flex flex-col gap-2 p-4">
        <NavbarLinks
          v-for="(link, index) in links"
          :key="index"
          :link-to="link.to"
          :title="link.title"
          :icon="link.icon"
          @click="sidebarOpen = false"
        />
      </nav>

      <div class="absolute bottom-6 left-0 right-0 flex flex-col items-start gap-4 px-4">
        <button class="p-3 text-gray-400 hover:text-black transition-colors"
                v-tooltip="'Einstellungen'"
        >
          <i class="pi pi-cog text-lg"></i>
        </button>
        <div
          v-tooltip="'Profil'"
          @click="toggleMenu"
          class="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:border-gray-300 transition-all"
        >
          <img src="https://placehold.co/600x400" alt="Profile" class="w-full h-full object-cover" />
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
        <button class="p-3 text-gray-400 hover:text-black transition-colors"
                v-tooltip="'Einstellungen'"
        >
          <i class="pi pi-cog text-lg"></i>
        </button>
        <div
          v-tooltip="'Profil'"
          @click="toggleMenu"
          class="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:border-gray-300 transition-all active:scale-95"
        >
          <img src="https://placehold.co/600x400" alt="Profile" class="w-full h-full object-cover" />
        </div>
        <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto md:mt-0 mt-14">
      <div class="max-w-full mx-auto">
        <slot/>
      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavbarLinks from './NavbarLinks.vue'
import Menu from 'primevue/menu'

const menu = ref(null)
const isLoggedIn = ref(false)
const sidebarOpen = ref(false)

const links = [
  { to: '/', title: 'Zuhause', icon: 'pi-home' },
  { to: '/about', title: 'Über uns', icon: 'pi-info-circle' },
  { to: '/schools', title: 'Fahrschulen', icon: 'pi-book' },
]

const menuItems = computed(() => {
  if (isLoggedIn.value) {
    return [
      { label: 'Profil', icon: 'pi pi-user' },
      { label: 'Logout', icon: 'pi pi-sign-out', command: () => { logout() } }
    ]
  } else {
    return [
      { label: 'Login', icon: 'pi pi-sign-in', command: () => { login() } }
    ]
  }
})

const toggleMenu = (event) => {
  menu.value.toggle(event)
}

const login = () => {
  isLoggedIn.value = true
}

const logout = () => {
  isLoggedIn.value = false
}
</script>
