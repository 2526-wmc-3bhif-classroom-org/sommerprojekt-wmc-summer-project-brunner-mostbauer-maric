<template>
  <nav class="bg-black p-6 border-b border-amber-500/30 relative z-50">
    <div class="flex space-x-8">
      <a
          v-for="(item, index) in navigation"
          :key="item.name.toLocaleUpperCase()"
          :href="item.href"
          @click.prevent="changeActive(item.name)"
          v-motion
          :initial="{ opacity: 0, y: 15, filter: 'blur(10px)' }"
          :enter="{
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
              delay: index * 150,
              duration: 800,
              ease: 'easeOut'
            }
          }"
          class="relative group px-2 py-1 cursor-pointer"
      >
        <span

            :class="[
            item.active ? 'text-amber-400' : 'text-amber-200/50 group-hover:text-amber-200',
            'relative text-lg font-medium tracking-wide transition-colors duration-500',
            'after:content-[\'\'] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-amber-500 after:transition-all after:duration-500 after:ease-in-out',
            item.active ? 'after:w-full' : 'after:w-0'
          ]"
        >
          {{ item.name }}
        </span>

        <div
            v-if="item.active"
            layoutId="activeBlob"
            class="absolute inset-0 -z-10 bg-amber-500/10 blur-xl rounded-full scale-150"
        ></div>

        <div
            :class="[
            item.active ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-50',
            'absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent transition-all duration-500'
          ]"
        ></div>
      </a>
    </div>
  </nav>
</template>

<script setup>
import { reactive } from "vue";

const navigation = reactive([
  { name: 'HOME', href: '#', active: true },
  { name: 'CALENDAR', href: '/calendar', active: false },
  {name: 'ABOUT US', href: '/about', active: false },
]);

const changeActive = (name) => {
  navigation.forEach((item) => {
    item.active = item.name === name;
  });
};
</script>