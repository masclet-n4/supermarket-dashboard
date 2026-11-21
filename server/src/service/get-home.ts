import type { ProductsRepository } from './products-repository'
import { getTrends } from './get-trends'
import type { HomeResponse } from './types/product-home'
import type { ProductTrendsCriteria } from './types/product-trends'

const biggestIncreaseCriteria = {
  period: '30',
  sortName: 'priceMovement',
  sortDirection: 'DESC',
  metric: 'percent',
  page: 1,
  perPage: 5,
} satisfies ProductTrendsCriteria
const biggestDecreaseCriteria = {
  period: '30',
  sortName: 'priceMovement',
  sortDirection: 'ASC',
  metric: 'percent',
  page: 1,
  perPage: 5,
} satisfies ProductTrendsCriteria
const mostChangesCriteria = {
  period: '30',
  sortName: 'priceChanges',
  sortDirection: 'DESC',
  page: 1,
  perPage: 5,
} satisfies ProductTrendsCriteria

export const getHome = async (
  productsRepository: ProductsRepository,
): Promise<HomeResponse> => {
  const [biggestIncrease, biggestDecrease, mostChanges, historicalMinimums] = await Promise.all([
    getTrends(biggestIncreaseCriteria, productsRepository),
    getTrends(biggestDecreaseCriteria, productsRepository),
    getTrends(mostChangesCriteria, productsRepository),
    productsRepository.getHistoricalMinimums(),
  ])

  return {
    historicalMinimums: historicalMinimums.map((product) => ({
      ...product,
      isHistoricalMinimum: true,
    })),
    trends: {
      period: '30',
      movementMetric: 'percent',
      biggestIncrease: biggestIncrease.items ?? [],
      biggestDecrease: biggestDecrease.items ?? [],
      mostChanges: mostChanges.items ?? [],
    },
  }
}
