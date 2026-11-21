import type { ProductStatsPeriod } from './product-stats'

export type ProductHistoryPeriod = ProductStatsPeriod | 'all'

export type ProductHistoryResponse = {
  period: ProductHistoryPeriod
  points: {
    date: string
    packagePrice: number | null
    referencePrice: number | null
  }[]
}
