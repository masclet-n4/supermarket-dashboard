<script setup>
import {computed, ref} from 'vue'
import ButtonGroup from './ButtonGroup.vue';
import {
  DEFAULT_TREND_FILTERS,
  TREND_METRIC_OPTIONS,
  TREND_PERIOD_OPTIONS,
  TREND_SUPERMARKET_OPTIONS,
} from '../enums/trends'

defineProps({
  open: Boolean
})


const emit = defineEmits(['close','onChangeFilters'])

const periodOptions = TREND_PERIOD_OPTIONS
const selectedPeriod = ref(DEFAULT_TREND_FILTERS.period)

const metricOptions = TREND_METRIC_OPTIONS
const selectedMetric = ref(DEFAULT_TREND_FILTERS.metric)

const supermarketOptions = TREND_SUPERMARKET_OPTIONS
const selectedSupermarket = ref(DEFAULT_TREND_FILTERS.supermarket)

const lastFilter = ref({ ...DEFAULT_TREND_FILTERS })

const filterChanged = computed(() => {
  if (
    selectedPeriod.value !== lastFilter.value.period ||
    selectedMetric.value !== lastFilter.value.metric ||
    selectedSupermarket.value !== lastFilter.value.supermarket
  ) {
    return true
  }
  return false
})

const handleChangeFilters = () => {

  const newFilters = {
    period: selectedPeriod.value,
    metric: selectedMetric.value,
  supermarket: selectedSupermarket.value
  }
  lastFilter.value = newFilters
  emit('onChangeFilters', newFilters)
  emit('close')


}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-60 bg-gray-500/30"
        @click.self="emit('close')"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="open"
        class="fixed inset-x-0 bottom-0 z-60 h-1/2 rounded-t-2xl bg-white p-4 shadow"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex flex-col gap-6">
          <div class="flex justify-between text-black">
            <div class="font-bold">Filtros</div>
            <button type="button" @click="emit('close')">X</button>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-gray-500 font-semibold">PERIODO</div>
            <div class="relative flex w-3/5 rounded bg-gray-100">
              <ButtonGroup
                :currentOption="selectedPeriod"
                :optionsList="periodOptions"
                @onChangeOption="(selectedOption) => selectedPeriod = periodOptions[selectedOption]"
              />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-gray-500 font-semibold">VARIACIÓN EN</div>
            <div class="relative flex w-3/7 rounded bg-gray-100">
              <ButtonGroup
                :currentOption="selectedMetric"
                :optionsList="metricOptions"
                @onChangeOption="(selectedOption) => selectedMetric = metricOptions[selectedOption]"
              />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-gray-500 font-semibold">TIENDA</div>
            <div class="relative flex w-3/4 rounded bg-gray-100">
              <ButtonGroup
                :currentOption="selectedSupermarket"
                :optionsList="supermarketOptions"
                @onChangeOption="(selectedOption) => selectedSupermarket = supermarketOptions[selectedOption]"
              />
            </div>
          </div>
          <div>
            <button
              class="w-full rounded-md bg-accent p-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              @click="handleChangeFilters()"
              :disabled="!filterChanged"
            >
              Ver resultados
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>

</style>
