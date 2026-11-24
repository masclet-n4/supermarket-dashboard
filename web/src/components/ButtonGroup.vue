<template>
      <div
        aria-hidden="true"
        :class="`absolute inset-y-0 left-0 flex transition-transform duration-300`"
        :style="{ transform: `translateX(${selectedOption * 100}%)`, width:  `${100 / optionsList.length}%` }"
      >
        <div class="m-1 flex-1 rounded bg-white shadow"></div>
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
import { ref, defineEmits, computed } from 'vue'

const { optionsList, currentOption } = defineProps < {
  optionsList: any[],
  currentOption?: string,
}>()


const emit = defineEmits(['onChangeOption'])

const currentIndexOption = computed(() => {
  return optionsList.findIndex((i) => {
    console.log({i, currentOption})
    return currentOption === i
  })
})

const selectedOption = ref(currentIndexOption?.value || 0)

function onChangeOption(index: number) {
  selectedOption.value = index
  emit('onChangeOption', index)
}
</script>
