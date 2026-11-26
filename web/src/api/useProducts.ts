import { ref } from 'vue'
import { DEFAULT_FILTER, PRODUCTS_SORT_MAP, type ProductsFilters } from '../enums/products'
import { SUPERMARKETS } from '../enums'

export function useProducts(initial: Partial<ProductsFilters> = {}) {
  const products = ref<{ id: string }[]>([])
  const filters = ref<ProductsFilters>({...DEFAULT_FILTER, ...initial})
  const loading = ref(false)
  const error = ref(false)

  async function getProducts(newFilters = filters.value) {
    filters.value = newFilters
    const {sort, page, q, supermarket} = newFilters
    loading.value = true
    error.value = false

    try {
      const params = new URLSearchParams({
        sort: PRODUCTS_SORT_MAP[sort],
        q,
        page: String(page)
      })
      const supermarketMapped = SUPERMARKETS[supermarket]

      if (supermarketMapped) params.set('supermarket', supermarketMapped)
      const response = await fetch(`/api/products?${params}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      products.value = data.items
    } catch (err) {
      console.error(err)
      error.value = true
    } finally {
      loading.value = false
    }
  }

  void getProducts()

  return { filters, products, loading, error, getProducts }
}
