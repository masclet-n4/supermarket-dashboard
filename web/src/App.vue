<template>
<NavBar @section-change="handleSectionChange" />
  <main class="p-4 pb-20 md:p-8">
      <component :is="sectionPage"/>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import NavBar from './components/NavBar.vue';
import HomePage from './pages/HomePage.vue';
import ProductsPage from './pages/ProductsPage.vue';
import TrendsPage from './pages/TrendsPage.vue';
import { SECTIONS, type Section } from './types/sections';

const currentSection = ref < Section > (SECTIONS.HOME)

const sectionPages = {
  [SECTIONS.HOME]: HomePage,
  [SECTIONS.TRENDS]: TrendsPage,
  [SECTIONS.PRODUCTS]: ProductsPage,
}

const sectionPage = computed(() =>  sectionPages[currentSection.value])

const handleSectionChange = (section: Section) => {
  currentSection.value = section
}
</script>
