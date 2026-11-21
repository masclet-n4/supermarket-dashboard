<template>
<div class="fixed inset-x-0 bottom-0 z-50 flex w-full items-center border-t border-line bg-surface p-3 md:static md:border-t-0 md:border-b md:p-4">
    <div class="flex gap-4 w-1/5 md:w-2/5 items-center font-semibold">
        <img :src="logo" alt="Logo" />
        <div class="hidden md:flex">Supermarket Tracker</div>
    </div>

    <nav class="relative grid w-5/7 grid-cols-3 items-center">
        <div
          aria-hidden="true"
          class="absolute inset-y-0 left-0 flex w-1/3 transition-transform duration-300"
          :style="{ transform: `translateX(${current * 100}%)` }"
        >
          <div class="m-1 flex-1 rounded bg-accent-subtle"></div>
        </div>

        <button
          v-for="(section, index) in sections"
          :key="section.code"
          type="button"
          class="relative z-10 flex flex-col items-center justify-center px-2 py-2 md:px-4"
          :class="index === current ? 'font-semibold text-accent' : 'text-secondary'"
          @click="select(index)"
        >
          <img class="md:hidden" :src="section.img" :alt="section.text" />
          {{ section.text }}
        </button>
    </nav>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import logo from '../assets/logo.svg'
import HomeIcon from '../assets/HomeIcon.svg'
import TrendsIcon from '../assets/TrendsIcon.svg'
import ProductsIcon from '../assets/ProductsIcon.svg'
import { SECTIONS, type Section } from '../types/sections'

const emit = defineEmits<{ sectionChange: [section: Section] }>()

const sections = [
  { img: HomeIcon, text: 'Inicio', code: SECTIONS.HOME },
  { img: TrendsIcon, text: 'Tendencias', code: SECTIONS.TRENDS },
  { img: ProductsIcon, text: 'Productos', code: SECTIONS.PRODUCTS },
]

const current = ref(0)

const select = (index: number) => {
  current.value = index
  emit('sectionChange', sections[index].code)
}
</script>
