import { isHistoricalMinimum } from './product-rules'
import type { ProductsRepository } from './products-repository'
import { PRODUCTS_PAGE_SIZE } from './types/product-search'
import type { ProductSearchCriteria, ProductSearchResponse } from './types/product-search'

export const getProducts = async (
  criteria: ProductSearchCriteria,
  productsRepository: ProductsRepository,
): Promise<ProductSearchResponse> => {
  const searchResult = await productsRepository.search(criteria)

  return {
    items: searchResult.items.map(({
      allTimeMinimumReferencePrice: minimum,
      allTimeMaximumReferencePrice: maximum,
      ...product
    }) => ({
      ...product,
      isHistoricalMinimum: isHistoricalMinimum(
        product.referencePrice,
        minimum,
        maximum,
      ),
    })),
    page: criteria.page,
    perPage: PRODUCTS_PAGE_SIZE,
    totalItems: searchResult.totalItems,
    totalPages: Math.ceil(searchResult.totalItems / PRODUCTS_PAGE_SIZE),
  }
}
