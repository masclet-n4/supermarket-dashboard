export const TREND_PERIODS = {
  '7 d': '7',
  '30 d': '30',
  '90 d': '90',
  '1 año': '356',
} as const

export type TrendPeriodLabel = keyof typeof TREND_PERIODS
export type TrendPeriod = (typeof TREND_PERIODS)[TrendPeriodLabel]

export const TREND_METRIC = {
  PERCENT: 'percent',
  ABSOLUTE: 'absolute',
} as const

export const TREND_METRICS = {
  '%': TREND_METRIC.PERCENT,
  '€/Ud': TREND_METRIC.ABSOLUTE,
} as const

export type TrendMetricLabel = keyof typeof TREND_METRICS
export type TrendMetric = (typeof TREND_METRIC)[keyof typeof TREND_METRIC]

export const TREND_STAT_TYPE = {
  CHANGES: 'CHANGE',
} as const

export const TREND_SORT_NAME = {
  PRICE_MOVEMENT: 'priceMovement',
  PRICE_CHANGES: 'priceChanges',
} as const

export const TREND_SORT_DIRECTION = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const

export const TREND_SUPERMARKETS = {
  Todas: null,
  Mercadona: 'mercadona',
  Consum: 'consum',
} as const

export type TrendSupermarketLabel = keyof typeof TREND_SUPERMARKETS

export const TREND_TABS = {
  Subidas: { sortName: TREND_SORT_NAME.PRICE_MOVEMENT, sortDirection: TREND_SORT_DIRECTION.DESC },
  Bajadas: { sortName: TREND_SORT_NAME.PRICE_MOVEMENT, sortDirection: TREND_SORT_DIRECTION.ASC },
  Cambios: { sortName: TREND_SORT_NAME.PRICE_CHANGES, sortDirection: TREND_SORT_DIRECTION.DESC },
} as const

export type TrendTab = keyof typeof TREND_TABS
export type TrendSortName = (typeof TREND_SORT_NAME)[keyof typeof TREND_SORT_NAME]
export type TrendSortDirection = (typeof TREND_SORT_DIRECTION)[keyof typeof TREND_SORT_DIRECTION]

export type TrendFilters = {
  period: TrendPeriodLabel
  metric: TrendMetricLabel
  supermarket: TrendSupermarketLabel
}

export const TREND_PERIOD_OPTIONS = Object.keys(TREND_PERIODS) as TrendPeriodLabel[]
export const TREND_METRIC_OPTIONS = Object.keys(TREND_METRICS) as TrendMetricLabel[]
export const TREND_SUPERMARKET_OPTIONS = Object.keys(TREND_SUPERMARKETS) as TrendSupermarketLabel[]
export const TREND_TAB_OPTIONS = Object.keys(TREND_TABS) as TrendTab[]

export const DEFAULT_TREND_FILTERS: TrendFilters = {
  period: TREND_PERIOD_OPTIONS[0],
  metric: TREND_METRIC_OPTIONS[0],
  supermarket: TREND_SUPERMARKET_OPTIONS[0],
}
export const DEFAULT_TREND_TAB = TREND_TAB_OPTIONS[0]
