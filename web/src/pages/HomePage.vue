<template>
<div class="p-2 flex flex-col gap-2">
    <div class="text-accent text-small">
        SEGUIMIENTO DIARIO DE PRECIOS
    </div>
    <div class="text-2xl font-bold">
        ¿Está caro hoy? Compáralo con su histórico.
    </div>
    <div>
        <div class="flex w-full items-center py-2 justify-between rounded-lg border-2 border-accent
         px-4">
             <img :src="SearchIcon" alt="" class="size-5 shrink-0" />

             <input
               class="min-w-0 border-0 py-3 outline-none"
               type="search"
               placeholder="Aceite, huevos..."
             />

             <button type="button" class=" bg-accent text-accent-subtle px-4 py-3 rounded-md">Buscar</button>
           </div>
    </div>
           <p v-if="homeProducts.error.value" class="text-down">No se pudieron cargar los datos.</p>
           <div class=" p-4 rounded-lg border border-line bg-surface flex flex-col gap-3">
               <strong>En su mínimo histórico hoy</strong>
               <div class="flex flex-col gap-4">
                   <ProductCardContent v-for="product in homeProducts.historicalMinimumsProducts.value" :product="product"/>
               </div>
           </div>
    <div>
           <div class="flex flex-col gap-4">
               <div class="font-bold text-h4">Últimos 30 días</div>
               <div class="relative flex w-4/6 rounded bg-gray-100">
                <ButtonGroup
                     :currentOption="trendTabs[selectedTab]"
                     :optionsList="trendTabs"
                     @onChangeOption="(selectedOption) => selectedTab = selectedOption"
                />
               </div>

               <div class="bg-accent-subtle rounded-lg flex flex-col gap-2 p-2">
                 <ProductCard
                 v-for="product in selectedTrendProducts" :key='`${product.id}-${selectedTab}`'
                 :product="product"/>
               </div>
           </div>
    </div>
</div>
</template>

<script setup>
import SearchIcon from "../assets/SearchIcon.svg"
import ProductCard from "../components/ProductCard.vue"
import ProductCardContent from "../components/ProductCardContent.vue"
import { computed, ref } from 'vue'
import { useHome } from "../api/useHome"
import ButtonGroup from "../components/ButtonGroup.vue"
import { TREND_TAB_OPTIONS } from '../enums/trends'

const homeProducts = useHome()
const trendTabs = TREND_TAB_OPTIONS
const selectedTab = ref(0)
const trendProducts = [
  homeProducts.biggestIncreaseProducts,
  homeProducts.biggestDecreaseProducts,
  homeProducts.mostChangesProducts,
]

const selectedTrendProducts = computed(
  () => {
    return trendProducts[selectedTab.value].value
  }
)
</script>
