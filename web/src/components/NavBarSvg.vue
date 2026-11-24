<template>
<img class="md:hidden text-accent" :src="url" :alt="text" />
{{ text }}
</template>

<script setup lang="ts">
const { text, url } = defineProps < {
  text: string,
  url: string,
}>()
</script>
