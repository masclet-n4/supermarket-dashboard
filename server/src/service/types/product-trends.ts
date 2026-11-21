import type { ProductStatsPeriod } from './product-stats'

export type ProductTrendSortName = 'priceMovement' | 'priceChanges'
export type ProductTrendMetric = 'absolute' | 'percent'
export type ProductTrendSortDirection = 'ASC' | 'DESC'
export const TRENDS_PAGE_SIZE = 10
export const TRENDS_MAX_PAGE_SIZE = 50

export type ProductTrendsCriteria = {
  period: ProductStatsPeriod
  sortName: ProductTrendSortName
  sortDirection: ProductTrendSortDirection
  metric?: ProductTrendMetric
  supermarket?: string
  page: number
  perPage?: number
}

export type ProductTrendDto = {
  id: string
  name: string | null
  brand: string | null
  supermarket: { slug: string; name: string } | null
  imageUrl: string | null
  quantity: number | null
  quantityUnit: string | null
  available: boolean | null
  packagePrice: number | null
  referencePrice: number | null
  statValue: number | null
  statType: string,
  statMetric: ProductTrendMetric | null,
  altValue: number | null
}

export type ProductTrendsPage = {
  items: ProductTrendDto[]
  totalItems: number
}

export type ProductTrendsResponse = ProductTrendsPage & {
  period: ProductStatsPeriod
  sortName: ProductTrendSortName
  sortDirection: ProductTrendSortDirection
  metric: ProductTrendMetric | null
  page: number
  perPage: number
  totalPages: number
}
