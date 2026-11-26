<template>
<div class="fixed inset-y-0 z-50 flex w-full h-1/20 items-center border-b border-line bg-surface md:hidden">
    <div class="flex gap-4 items-center p-2">
        <img :src="logo" alt="Logo" />
        <div class="font-bold">Supermarket Tracker</div>
    </div>
</div>
<div class="fixed inset-x-0 bottom-0 z-50 flex w-full items-center border-t border-line bg-surface p-3 md:static md:border-t-0 md:border-b md:p-4">
    <div class="md:flex gap-4 w-1/5 md:w-2/5 items-center font-semibold hidden">
        <img :src="logo" alt="Logo" />
        <div class="hidden md:flex">Supermarket Tracker</div>
    </div>

    <nav class="relative grid w-full grid-cols-3 items-center">
        <div
          aria-hidden="true"
          class="absolute inset-y-0 left-0 flex w-1/3 transition-transform duration-300"
          :style="{ transform: `translateX(${current * 100}%)` }"
        >
          <div class="m-1 flex-1 rounded bg-accent-subtle"></div>
        </div>

        <button
          type="button"
          :class="current === 0 ? 'font-semibold text-accent' : 'text-secondary'"
          class="relative z-10 flex flex-col items-center justify-center px-2 py-2 md:px-4"
          @click="select(0)"
        >
          <svg class="md:hidden" width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path transform="matrix(1 0 0 1 2.75 3.44)" d="M0 6.87L8.25 0L16.5 6.87L16.5 15.81L11 15.81L11 10.31L5.5 10.31L5.5 15.81L0 15.81L0 6.87Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Inicio
        </button>
        <button
          type="button"
          :class="current === 1 ? 'font-semibold text-accent' : 'text-secondary'"
          class="relative z-10 flex flex-col items-center justify-center px-2 py-2 md:px-4"
          @click="select(1)"
        >
          <svg class="md:hidden" width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path transform="matrix(1 0 0 1 2.06 6.19)" d="M0 10.31L5.5 4.81L9.63 8.25L17.19 0M12.38 0L17.19 0L17.19 4.81" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Tendencias
        </button>
        <button
          type="button"
          :class="current === 2 ? 'font-semibold text-accent' : 'text-secondary'"
          class="relative z-10 flex flex-col items-center justify-center px-2 py-2 md:px-4"
          @click="select(2)"
        >
          <svg class="md:hidden" width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path transform="matrix(1 0 0 1 2.75 5.5)" d="M4.81 0L16.5 0M4.81 5.5L16.5 5.5M4.81 11L16.5 11M0 0L0.69 0M0 5.5L0.69 5.5M0 11L0.69 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Productos
        </button>
    </nav>
</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import logo from '../assets/logo.svg'
import { SECTIONS, type Section } from '../types/sections'

const props = defineProps<{ section: Section }>()
const emit = defineEmits<{ sectionChange: [section: Section] }>()

const sections = [SECTIONS.HOME, SECTIONS.TRENDS, SECTIONS.PRODUCTS]

const current = computed(() => sections.indexOf(props.section))

const select = (index: number) => {
  emit('sectionChange', sections[index])
}
</script>
