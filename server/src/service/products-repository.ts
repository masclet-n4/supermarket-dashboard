import type { ProductDetailsRecord } from './types/product-details'
import type { ProductHistoryPeriod, ProductHistoryResponse } from './types/product-history'
import type { ProductSearchCriteria, ProductSearchPage } from './types/product-search'
import type { ProductTrendsCriteria, ProductTrendsPage } from './types/product-trends'
import type { HistoricalMinimumRecord } from './types/product-home'

/** Puerto de lectura que implementará el adaptador de PocketBase. */
export interface ProductsRepository {
  search(criteria: ProductSearchCriteria): Promise<ProductSearchPage>
  getProductDetailsById(id: string): Promise<ProductDetailsRecord | null>
  getProductHistoryPricesById(id: string, period: ProductHistoryPeriod): Promise<ProductHistoryResponse>
  getTrends(criteria: ProductTrendsCriteria): Promise<ProductTrendsPage>
  getHistoricalMinimums(): Promise<HistoricalMinimumRecord[]>
}
