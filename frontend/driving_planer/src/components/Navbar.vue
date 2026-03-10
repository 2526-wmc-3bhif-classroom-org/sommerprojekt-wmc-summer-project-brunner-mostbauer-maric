<template>
  <div class="flex h-screen bg-slate-50 font-sans">
    <aside class="w-20 flex flex-col items-center py-6 bg-white border-r border-gray-200 shadow-sm">
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
        <button v-ripple class="p-3 text-gray-400 hover:text-black transition-colors">
          <i class="pi pi-cog text-lg"></i>
        </button>

        <div
          @click="toggleMenu"
          aria-haspopup="true"
          aria-controls="overlay_menu"
          class="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:border-gray-300 transition-all active:scale-95"
        >
          <img
            src="https://placehold.co/600x400"
            alt="Profile"
            class="w-full h-full object-cover"
          />
        </div>

        <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />
      </div>
    </aside>

    <main class="flex-1 overflow-y-auto">
      <div class="p-8 max-w-7xl mx-auto">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavbarLinks from './NavbarLinks.vue'
import Menu from 'primevue/menu'

const menu = ref(null)
const isLoggedIn = ref(false);

const links = [
  { to: '/', title: 'Home', icon: 'pi-home' },
  { to: '/about', title: 'About', icon: 'pi-info-circle' },
  { to: '/schools', title: 'Schools', icon: 'pi-book' },
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
  console.log("Login clicked")
  isLoggedIn.value = true
}

const logout = () => {
  console.log("Logout clicked")
  isLoggedIn.value = false
}
</script>
