<template>
    <div class="flex px-1 font-semibold rounded justify-center">
        <div>{{getSign()}}</div>
        <div>{{formatEs(num)}}</div>
        <div v-if="metric === TREND_METRIC.PERCENT"> %</div>
        <div v-else> €{{quantityUnit ? `/${quantityUnit}` : ""}}</div>

    </div>
</template>

<script setup lang="ts">
import { formatEs } from '../format'
import { TREND_METRIC, type TrendMetric } from '../enums/trends'
const {num, metric} = defineProps < {
  num: number,
  metric: TrendMetric | null,
  quantityUnit: string | null,
}>()


const getSign = () => {

  if (num > 0) return "+"
}



</script>
