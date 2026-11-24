<template>
<div>
<img
    v-if="!imageFailed"
    :src="url"
    class="aspect-square w-full object-contain"
    @error="imageFailed = true"
/>
  <div
    v-else
    class="flex aspect-square w-full items-center justify-center rounded bg-gray-100 text-center"
  >
      Sin imagen
  </div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const { url } = defineProps < {
  url: string
}>()

const imageFailed = ref(false)


</script>
