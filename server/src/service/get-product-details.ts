import { isHistoricalMinimum } from './product-rules'
import type { ProductsRepository } from './products-repository'
import type { ProductDetailsResponse } from './types/product-details'
import type { ProductHistoryPeriod, ProductHistoryResponse } from './types/product-history'

export const getHistoryStartDate = (
  period: ProductHistoryPeriod,
  now = new Date(),
): string | null => {
  if (period === 'all') return null

  const from = new Date(now)
  from.setUTCDate(from.getUTCDate() - Number(period))
  return from.toISOString().slice(0, 10)
}

export const getProductDetails = async (
  id: string,
  productsRepository: ProductsRepository,
): Promise<ProductDetailsResponse | null> => {
  const record = await productsRepository.getProductDetailsById(id)
  if (!record) return null

  const {
    allTimeMinimumReferencePrice: minimum,
    allTimeMaximumReferencePrice: maximum,
    ...product
  } = record.product

  return {
    ...record,
    product: {
      ...product,
      isHistoricalMinimum: isHistoricalMinimum(
        product.referencePrice,
        minimum,
        maximum,
      ),
    },
  }
}

export const getProductHistoryPrices = (
  id: string,
  period: ProductHistoryPeriod,
  productsRepository: ProductsRepository,
): Promise<ProductHistoryResponse> =>
  productsRepository.getProductHistoryPricesById(id, period)
