import { expect, test } from "bun:test"
import { getProducts } from "../get-products"
import type { ProductsRepository } from "../products-repository"
import type { ProductSearchRecord } from "../types/product-search"

const product = (
  id: string,
  referencePrice: number | null,
  min: number | null,
  max: number | null,
): ProductSearchRecord => ({
  id,
  name: id,
  brand: null,
  supermarket: null,
  imageUrl: null,
  quantity: null,
  quantityUnit: null,
  available: null,
  packagePrice: null,
  referencePrice,
  deviationFromMean30dPercent: null,
  allTimeMinimumReferencePrice: min,
  allTimeMaximumReferencePrice: max,
})

test("handles missing stats, stable prices, and an all-time minimum", async () => {
  const items = [
    product("missing-stats", 5, null, null),
    product("stable", 5, 5, 5),
    product("minimum", 3, 3, 5),
  ]
  const repository: ProductsRepository = {
    search: async () => ({ items, totalItems: items.length }),
    getProductDetailsById: async () => null,
    getProductHistoryPricesById: async (_id, period) => ({ period, points: [] }),
    getTrends: async () => ({ items: [], totalItems: 0 }),
    getHistoricalMinimums: async () => [],
  }

  const response = await getProducts(
    { q: "", sort: "referencePriceAsc", page: 1 },
    repository,
  )

  expect(response.items.map(({ isHistoricalMinimum }) => isHistoricalMinimum))
    .toEqual([null, false, true])
})
