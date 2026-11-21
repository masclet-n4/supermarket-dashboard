import type { ProductCardDto } from './product-search'
import type { ProductStatsPeriod } from './product-stats'
import type { ProductTrendDto, ProductTrendMetric } from './product-trends'

export const HOME_HISTORICAL_MINIMUMS_COUNT = 4

/** Producto ya mapeado por el repositorio, sin el estado derivado del DTO. */
export type HistoricalMinimumRecord = Omit<ProductCardDto, 'isHistoricalMinimum'>

/** Una tarjeta de esta lista representa necesariamente un mínimo histórico. */
export type HistoricalMinimumDto = HistoricalMinimumRecord & {
  isHistoricalMinimum: true
}

export type HomeResponse = {
  historicalMinimums: HistoricalMinimumDto[]
  trends: {
    period: ProductStatsPeriod
    movementMetric: ProductTrendMetric
    biggestIncrease: ProductTrendDto[]
    biggestDecrease: ProductTrendDto[]
    mostChanges: ProductTrendDto[]
  }
}
