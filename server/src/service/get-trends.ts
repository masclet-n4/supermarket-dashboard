import type { ProductsRepository } from './products-repository'
import { TRENDS_PAGE_SIZE } from './types/product-trends'
import type { ProductTrendsCriteria, ProductTrendsResponse } from './types/product-trends'

export const getTrends = async (
  criteria: ProductTrendsCriteria,
  productsRepository: ProductsRepository,
): Promise<ProductTrendsResponse> => {
  const perPage = criteria.perPage ?? TRENDS_PAGE_SIZE
  const result = await productsRepository.getTrends({ ...criteria, perPage })
  return {
    ...result,
    period: criteria.period,
    sortName: criteria.sortName,
    sortDirection: criteria.sortDirection,
    metric: criteria.sortName === 'priceMovement' ? criteria.metric ?? 'absolute' : null,
    page: criteria.page,
    perPage,
    totalPages: Math.ceil(result.totalItems / perPage),
  }
}
