<template>
<div v-if="!isChanges">
    <div :class="`${ getStyle() } flex gap-2 px-1 font-semibold rounded`">
            <div v-if="metric === TREND_METRIC.PERCENT">{{getSign()}}</div>
            <div> {{formatEs(num)}}</div>
            <div v-if="metric === TREND_METRIC.PERCENT"> %</div>
    </div>
</div>
<div v-else>
    <div class="bg-gray-100 rounded p-1"> {{num}} cambios </div>
</div>
</template>

<script setup lang="ts">
import { formatEs } from '../format'
import { TREND_METRIC, type TrendMetric } from '../enums/trends'
const {num, metric, isChanges} = defineProps < {
  num: number,
  metric: TrendMetric | null,
  isChanges: boolean
}>()


const getSign = () => {
  if (num < 0) return "▼"
  if (num > 0) return "▲"
}

const getStyle = () => {
  if(num < 0) return "bg-down-bg text-down"
  if (num > 0) return "bg-up-bg text-up"
  return " bg-gray"
}


</script>
