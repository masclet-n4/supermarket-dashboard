import { ref } from 'vue'
import {
  DEFAULT_TREND_FILTERS,
  DEFAULT_TREND_TAB,
  TREND_METRICS,
  TREND_PERIODS,
  TREND_SORT_NAME,
  TREND_SUPERMARKETS,
  TREND_TABS,
  type TrendFilters,
  type TrendTab,
} from '../enums/trends'

export function useTrends() {
  const filters = ref<TrendFilters>({ ...DEFAULT_TREND_FILTERS })
  const trendList = ref<{ id: string }[]>([])
  const loading = ref(false)
  const error = ref(false)

  async function getTrendsData(nextFilters = filters.value, selectedTab: TrendTab = DEFAULT_TREND_TAB) {
    filters.value = nextFilters
    loading.value = true
    error.value = false

    try {
      const { sortName, sortDirection } = TREND_TABS[selectedTab]
      const params = new URLSearchParams({
        period: TREND_PERIODS[nextFilters.period],
        sortName,
        sortDirection,
        page: '1',
      })
      const metric = sortName === TREND_SORT_NAME.PRICE_MOVEMENT ? TREND_METRICS[nextFilters.metric] : null
      const supermarket = TREND_SUPERMARKETS[nextFilters.supermarket]

      if (metric) params.set('metric', metric)
      if (supermarket) params.set('supermarket', supermarket)

      const response = await fetch(`/api/trends?${params}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      trendList.value = data.items
    } catch (err) {
      console.error(err)
      error.value = true
    } finally {
      loading.value = false
    }
  }

  void getTrendsData()

  return { filters, trendList, loading, error, getTrendsData }
}
