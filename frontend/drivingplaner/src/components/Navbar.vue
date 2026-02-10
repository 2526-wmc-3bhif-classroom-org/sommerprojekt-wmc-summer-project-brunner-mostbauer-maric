<template>
  <nav class="bg-black p-4 border-b border-amber-500">

    <div class="inline-flex space-x-4">
      <a
          v-for="item in navigation"
          :key="item.name"
          :href="item.href"
          :class="[
            item.active ? 'bg-zinc-900 text-amber-500 shadow-inner' : 'text-amber-300/70 hover:text-amber-300 hover:bg-zinc-900/50',
                            'px-4 py-2 rounded-md text-1xl font-semibold transition-all duration-200'
            ]"
        @click.prevent="changeActive(item.name)"
      >
        {{ item.name }}
      </a>
    </div>
  </nav>
</template>

<script setup>
import {reactive} from "vue";

const navigation = reactive([
  { name: 'Home', href: '#', active: true },
  { name: 'Calendar', href: '/calendar', active: false },
]);

const changeActive = (name) => {
  navigation.forEach((item) => {
    if (item.name === name) {
      item.active = true
    }else {
      item.active = false
    }
  })
}
</script>