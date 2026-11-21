<template>
      <div
        aria-hidden="true"
        class="absolute inset-y-0 left-0 flex w-1/3 transition-transform duration-300"
        :style="{ transform: `translateX(${selectedOption * 100}%)` }"
      >
        <div class="m-1 flex-1 rounded bg-white"></div>
      </div>

      <button
        v-for="(tab, index) in optionsList"
        :key="tab"
        type="button"
        class="relative z-10 flex-1 p-2 text-center"
        @click="onChangeOption(index)"
      >
        {{ tab }}
      </button>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

const { optionsList } = defineProps < {
  optionsList: any[]
}>()

const emit = defineEmits(['onChangeOption'])

const selectedOption = ref(0)

function onChangeOption(index: number) {
  selectedOption.value = index
  emit('onChangeOption', index)
}
</script>
