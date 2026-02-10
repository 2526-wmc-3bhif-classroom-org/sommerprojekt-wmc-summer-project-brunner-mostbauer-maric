<template>
  <nav class="bg-black p-6 relative z-50">
    <div class="flex items-center justify-between w-full">

      <div class="flex space-x-8"><!-- This are the normal navbar links that are on the left side -->
        <a
            v-for="(item, index) in navigation"
            :key="item.name"
            :href="item.href"
            @click.prevent="changeActive(item.name)"
            v-motion
            :initial="{ opacity: 0, y: 15, filter: 'blur(10px)' }"
            :enter="{
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { delay: index * 150, duration: 800, ease: 'easeOut' }
          }"
            class="relative group px-2 py-1 cursor-pointer"
        >
          <span
              :class="[
              item.active ? 'text-amber-400' : 'text-amber-200/50 group-hover:text-amber-200',
              'relative text-lg font-medium tracking-wide transition-colors duration-500',
              'after:content-[\'\'] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-amber-500 after:transition-all after:duration-500',
              item.active ? 'after:w-full' : 'after:w-0'
            ]"
          >
            {{ item.name }}
          </span>
          <div v-if="item.active" class="absolute inset-0 -z-10 bg-amber-500/10 blur-xl rounded-full scale-150"></div>
        </a>
      </div>

      <div class="relative" ref="dropdownContainer"> <!-- This is the profile image-->
        <button
            @click.stop="toggleDropdown"
            v-motion
            :initial="{ opacity: 0, scale: 0.8 }"
            :enter="{ opacity: 1, scale: 1, transition: { delay: 600 } }"
            class="relative group flex items-center focus:outline-none"
        >
          <div class="absolute inset-0 bg-amber-500/40 blur-xl rounded-full scale-110 group-hover:scale-150 transition-all duration-500"></div>
          <img
              src="https://placehold.co/150x150"
              alt="profile"
              class="w-10 h-10 rounded-full border border-amber-500/50 relative z-10 object-cover"
          />

        </button>
        <!-- This is the drop down of the profile picture-->
        <div
            v-if="isDropdownOpen"
            v-motion
            :initial="{ opacity: 0, y: -10, scale: 0.95 }"
            :enter="{ opacity: 1, y: 0, scale: 1 }"
            class="absolute right-0 mt-3 w-48 bg-zinc-900 border border-amber-500/20 rounded-xl shadow-2xl py-2 z-[60]"
        >
          <a href="/profile" class="block px-4 py-2 text-amber-200/70 hover:text-amber-400 hover:bg-white/5 transition-colors">Profile</a>
          <a href="/settings" class="block px-4 py-2 text-amber-200/70 hover:text-amber-400 hover:bg-white/5 transition-colors">Settings</a>
          <hr class="border-amber-500/10 my-1" />
          <a href="/logout" v-if="login" class="block px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors">Logout</a>
          <a href="/login" v-if="!login" class="block px-4 py-2 text-green-400 hover:bg-green-500/10 transition-colors">Login</a>
        </div>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { reactive } from "vue";
import { ref, onMounted, onUnmounted } from "vue";


const login = ref(false);
// This are the values for the navbar links on the left side
const navigation = reactive([
  { name: 'HOME', href: '#', active: true },
  { name: 'CALENDAR', href: '/calendar', active: false },
  {name: 'ABOUT US', href: '/about', active: false },
]);

// This is the methode that changes the active property of navigation values by an onclick.
const changeActive = (name) => {
  navigation.forEach((item) => {
    item.active = item.name === name;
  });
};

const isDropdownOpen = ref(false);
const dropdownContainer = ref(null); // Reference on the HTML tag

// Clicking dropdown trigger
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Logic for closing the dropdown
const closeOnClickOutside = (event) => {
  if (isDropdownOpen.value && dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

// checks if user clicks outside of dropdown
onMounted(() => {
  window.addEventListener('click', closeOnClickOutside);
});

// checks if user clicks outside of dropdown
onUnmounted(() => {
  window.removeEventListener('click', closeOnClickOutside);
});
</script>