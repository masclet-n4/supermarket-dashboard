<template>
<div class="flex w-full items-center gap-2 text-[11px]">
    <div class="w-1/5 shrink-0 self-center">
        <ProductImage :url="imageUrl"/>
    </div>
    <div class="min-w-0 flex-1">
        <div class="flex gap-2">
            <div v-if="supermarket"><SupermarketBadge :supermarketName="supermarket.name"/></div>
                <HistoricalMinimumBadge v-if="isHistoricalMinimum"/>
        </div>
        <div class="line-clamp-2 font-bold">{{name}}</div>
        <div class="truncate flex">
            <div class="font-bold text-sm">{{formatEs(packagePrice)}}€ </div> <div class="self-center ml-1"> · {{formatEs(referencePrice)}}  €/{{quantityUnit}} </div>
        </div>
    </div>
    <div class="shrink-0 self-center flex-col">
         <PrettyStat :num="statValue" :metric="statMetric" :isChanges="product.statType === 'CHANGE'"/>
        <div
        v-if="product.statType && product.statType!== 'CHANGE'"
        class="text-ink-muted text-center"
        >
          <PrettyDiff :num="altValue"  :metric="getAltMetric()" :quantityUnit="quantityUnit"/>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import HistoricalMinimumBadge from './HistoricalMinimumBadge.vue';
import PrettyDiff from './PrettyDiff.vue';
import PrettyStat from './PrettyStat.vue';
import ProductImage from './ProductImage.vue';
import SupermarketBadge from './SupermarketBadge.vue';
import { formatEs } from '../format';

const {product} = defineProps < {
product: any
}>()

const {
  referencePrice,
  imageUrl,
  name,
  packagePrice,
  supermarket,
  statValue,
  statMetric,
  altValue,
  isHistoricalMinimum,
  quantityUnit
} = product

function getAltMetric() {
  if (statMetric === "percent") return "absolute"
  if (statMetric === "absolute") return "percent"
  return null
}

</script>
