import { expect, test } from 'bun:test'
import { getHome } from '../get-home'
import type { ProductsRepository } from '../products-repository'
import type { HistoricalMinimumRecord } from '../types/product-home'
import type { ProductTrendDto } from '../types/product-trends'

const minimum: HistoricalMinimumRecord = {
  id: 'minimum',
  name: 'Minimum price product',
  brand: null,
  supermarket: null,
  imageUrl: null,
  quantity: null,
  quantityUnit: null,
  available: true,
  packagePrice: 2,
  referencePrice: 1,
  deviationFromMean30dPercent: null,
}

const trend = (id: string): ProductTrendDto => ({
  id,
  name: id,
  brand: null,
  supermarket: null,
  imageUrl: null,
  quantity: null,
  quantityUnit: null,
  available: true,
  packagePrice: null,
  referencePrice: null,
  statType: "",
  statMetric: null,
  statValue: 1,
  altValue: null,
})

test('builds home from four independent, one-item repository queries', async () => {
  const criteriaReceived: unknown[] = []
  const repository: ProductsRepository = {
    search: async () => ({ items: [], totalItems: 0 }),
    getProductDetailsById: async () => null,
    getProductHistoryPricesById: async (_id, period) => ({ period, points: [] }),
    getTrends: async (criteria) => {
      criteriaReceived.push(criteria)
      return { items: [trend(criteria.sortName + criteria.sortDirection)], totalItems: 1 }
    },
    getHistoricalMinimums: async () => [minimum],
  }

  const response = await getHome(repository)

  expect(criteriaReceived).toEqual([
    {
      period: '30', sortName: 'priceMovement', sortDirection: 'DESC',
      metric: 'percent', page: 1, perPage: 5,
    },
    {
      period: '30', sortName: 'priceMovement', sortDirection: 'ASC',
      metric: 'percent', page: 1, perPage: 5,
    },
    {
      period: '30', sortName: 'priceChanges', sortDirection: 'DESC',
      page: 1, perPage: 5,
    },
  ])
  expect(response.historicalMinimums).toEqual([{
    ...minimum,
    isHistoricalMinimum: true,
  }])
  expect([
    response.trends.biggestIncrease[0]?.id,
    response.trends.biggestDecrease[0]?.id,
    response.trends.mostChanges[0]?.id,
  ]).toEqual(['priceMovementDESC', 'priceMovementASC', 'priceChangesDESC'])
})
