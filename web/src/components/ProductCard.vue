<template>
<div class="border border-line rounded-lg p-4 bg-white">
  <ProductCardContent :product="product" />
</div>
</template>

<script setup lang="ts">
import ProductCardContent from './ProductCardContent.vue';

const { product } = defineProps < {
  product: any
} > ()


</script>
