import { type SupermarketLabels } from "."
export const PRODUCTS_SORT_MAP = {
  "€/U: más barato": "referencePriceAsc",
  "Precio: más barato": "packagePriceAsc",
  "Precio: más caro": "packagePriceDesc",
} as const


export type ProductsFilters = {
  q: string
  page: number
  supermarket: SupermarketLabels,
  sort: keyof typeof PRODUCTS_SORT_MAP
}

export const DEFAULT_FILTER: ProductsFilters = {
  page: 1,
  sort: "€/U: más barato",
  supermarket: "Todas",
  q: ""
}

export const PRODUCTS_SORT = ['€/U: más barato', 'Precio: más barato', 'Precio: más caro'] as const
