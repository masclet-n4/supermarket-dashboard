import type { ProductPeriodStatsDto } from '../../service/types/product-details'
import type { ProductStatsPeriod } from '../../service/types/product-stats'
import type { ProductSort } from '../../service/types/product-search'
import type { ProductTrendsCriteria } from '../../service/types/product-trends'
import type { PocketBaseProductStatsRecord } from './types'

export const MAPPED_SORT = {
  referencePriceAsc: 'current_price',
  packagePriceAsc: 'unit_price',
  packagePriceDesc: '-unit_price',
  biggestDecrease30d: 'products_stats_via_product_id.price_diff_mean_pct_d30',
  biggestIncrease30d: '-products_stats_via_product_id.price_diff_mean_pct_d30',
} satisfies Record<ProductSort, string>

export const mapPeriodStats = (
  record: PocketBaseProductStatsRecord | undefined,
  period: `d${ProductStatsPeriod}` | 'all',
): ProductPeriodStatsDto | null => {
  if (!record) return null

  const suffix = period
  return {
    meanReferencePrice: record[`mean_price_${suffix}`] ?? null,
    priceDifferenceFromMean: record[`price_diff_mean_${suffix}`] ?? null,
    priceDifferenceFromMeanPercent: record[`price_diff_mean_pct_${suffix}`] ?? null,
    minReferencePrice: record[`price_min_${suffix}`] ?? null,
    maxReferencePrice: record[`price_max_${suffix}`] ?? null,
    numChanges: record[`num_changes_${suffix}`] ?? null,
  }
}

// Un único sitio decide el campo de orden: el valor mostrado y el filtro son el mismo campo.
export const getTrendSortField = (criteria: ProductTrendsCriteria): string => {
  if (criteria.sortName === 'priceChanges') return `num_changes_d${criteria.period}`
  const pct = criteria.metric === 'percent' ? '_pct' : ''
  return `price_diff_mean${pct}_d${criteria.period}`
}

export const getTrendSort = (criteria: ProductTrendsCriteria): string =>
  `${criteria.sortDirection === 'DESC' ? '-' : ''}${getTrendSortField(criteria)}`

export const getTrendStatType = (criteria: ProductTrendsCriteria): string => {
  if (criteria.sortName === 'priceChanges') return 'CHANGE'
  return criteria.sortDirection === 'DESC' ? 'INCREASE' : 'DECREASE'
}

export const getTrendValue = (
  record: PocketBaseProductStatsRecord,
  criteria: ProductTrendsCriteria,
): number | null => {
  const period = `d${criteria.period}` as `d${ProductStatsPeriod}`
  if (criteria.sortName === 'priceChanges') return record[`num_changes_${period}`] ?? null
  return criteria.metric === 'percent'
    ? record[`price_diff_mean_pct_${period}`] ?? null
    : record[`price_diff_mean_${period}`] ?? null
}

export const getAltTrendValue = (
  record: PocketBaseProductStatsRecord,
  criteria: ProductTrendsCriteria,
): number | null => {
  const period = `d${criteria.period}` as `d${ProductStatsPeriod}`
  if (criteria.sortName === 'priceChanges') return record[`num_changes_${period}`] ?? null
  return criteria.metric !== 'percent'
    ? record[`price_diff_mean_pct_${period}`] ?? null
    : record[`price_diff_mean_${period}`] ?? null
}
