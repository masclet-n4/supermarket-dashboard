<script setup lang="ts">
import ButtonGroup from '../components/ButtonGroup.vue';
import {ref} from 'vue'
import FilterModal from '../components/FilterModal.vue';
import { useTrends } from '../api/useTrends';
import ProductCard from '../components/ProductCard.vue';
import FilterIcon from '../assets/FilterIcon.svg'
import { DEFAULT_TREND_TAB, TREND_TAB_OPTIONS, type TrendFilters, type TrendTab } from '../enums/trends';

const {filters, trendList, getTrendsData} = useTrends()
const selectedTab = ref<TrendTab>(DEFAULT_TREND_TAB)
const showFilterModal = ref(false)

function handleTabChange(index: number) {
  selectedTab.value = TREND_TAB_OPTIONS[index]
  void getTrendsData(filters.value, selectedTab.value)
}

function handleFiltersChange(newFilters: TrendFilters) {
  void getTrendsData(newFilters, selectedTab.value)
}
</script>

<template>
    <div class="p-2 flex flex-col gap-2">
        <div class="text-h1 font-bold">Tendencias</div>
        <div class="relative flex w-4/6 rounded bg-gray-100">
         <ButtonGroup
            :currentOption="selectedTab"
              :optionsList="TREND_TAB_OPTIONS"
              @onChangeOption="handleTabChange"
         />
        </div>
        <div class="flex w-4/7">
            <botton
            class="border rounded border-line p-2 bg-white font-semibold"
            name="filters"
            id="filter-botton"
            @click="showFilterModal = true"
            >
                <div class="flex gap-2">
                    <div><img :src="FilterIcon"/></div>
                    <div>{{filters.period}} · {{filters.metric}} · {{filters.supermarket}}</div>
                </div>
            </botton>
        </div>
        <div class="flex flex-col gap-2">
            <ProductCard v-for="(product, i) in trendList" :key='`${product.id}-${i}`' :product="product"/>
        </div>
    </div>
    <FilterModal
      :open="showFilterModal"
      @close="showFilterModal = false"
      @onChangeFilters="handleFiltersChange"
    />
</template>
