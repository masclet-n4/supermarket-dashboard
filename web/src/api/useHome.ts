import { ref } from 'vue'

export function useHome() {
  const historicalMinimumsProducts = ref([])
  const biggestIncreaseProducts = ref([])
  const biggestDecreaseProducts = ref([])
  const mostChangesProducts = ref([])

  const loading = ref(false)
  const error = ref(false)

  async function getHomeData() {
    loading.value = true
    error.value = false
    try {
      const response = await fetch('/api/home')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const homeProducts = await response.json()
      historicalMinimumsProducts.value = homeProducts.historicalMinimums
      biggestIncreaseProducts.value = homeProducts.trends.biggestIncrease
      biggestDecreaseProducts.value = homeProducts.trends.biggestDecrease
      mostChangesProducts.value = homeProducts.trends.mostChanges
    } catch (err) {
      console.error(err)
      error.value = true
    } finally {
      loading.value = false
    }
  }

  getHomeData()

  return {historicalMinimumsProducts, biggestDecreaseProducts, biggestIncreaseProducts, mostChangesProducts, loading, error}
}
