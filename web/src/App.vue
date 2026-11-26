<template>
<NavBar :section="currentSection" @section-change="handleSectionChange" />
  <main class="px-4 pt-12 pb-20 md:p-8">
      <component :is="sectionPage" :q="searchQuery" @search="handleSearch"/>
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
const searchQuery = ref('')

const sectionPages = {
  [SECTIONS.HOME]: HomePage,
  [SECTIONS.TRENDS]: TrendsPage,
  [SECTIONS.PRODUCTS]: ProductsPage,
}

const sectionPage = computed(() =>  sectionPages[currentSection.value])

const handleSectionChange = (section: Section) => {
  searchQuery.value = ''
  currentSection.value = section
}

const handleSearch = (q: string) => {
  searchQuery.value = q
  currentSection.value = SECTIONS.PRODUCTS
}
</script>
