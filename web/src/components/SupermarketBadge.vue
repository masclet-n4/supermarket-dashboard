<template>
<div class="text-[11px] rounded-md p-1 bg-gray-100 items-center gap-1 inline-flex">
    <div class="rounded px-1 bg-black text-accent-subtle font-bold"> {{supermarketName.substring(0,1)}} </div>
    <div> {{supermarketName}} </div>
</div>
</template>

<script setup lang="ts">
const {supermarketName} = defineProps < {
supermarketName: string
}>()


</script>
