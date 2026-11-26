export const SORT_DIRECTION = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const

export const SUPERMARKETS = {
  Todas: null,
  Mercadona: 'mercadona',
  Consum: 'consum',
} as const


export type SupermarketLabels = keyof typeof SUPERMARKETS
