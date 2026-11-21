export const PRODUCTS_PAGE_SIZE = 8

export type ProductSort =
  | 'referencePriceAsc'
  | 'packagePriceAsc'
  | 'packagePriceDesc'
  | 'biggestDecrease30d'
  | 'biggestIncrease30d'

export type ProductSearchCriteria = {
  q: string
  /** Slug estable del supermercado, no el ID interno de PocketBase. */
  supermarket?: string
  sort: ProductSort
  page: number
}

/** Datos agnósticos de persistencia que necesita el caso de uso. */
export type ProductSearchRecord = {
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
  deviationFromMean30dPercent: number | null
  allTimeMinimumReferencePrice: number | null
  allTimeMaximumReferencePrice: number | null
}

export type ProductSearchPage = {
  items: ProductSearchRecord[]
  totalItems: number
}

/** Forma pública de la tarjeta; no expone los extremos usados para calcularla. */
export type ProductCardDto = Omit<
  ProductSearchRecord,
  'allTimeMinimumReferencePrice' | 'allTimeMaximumReferencePrice'
> & {
  isHistoricalMinimum: boolean | null
}

export type ProductSearchResponse = {
  items: ProductCardDto[]
  page: number
  perPage: typeof PRODUCTS_PAGE_SIZE
  totalItems: number
  totalPages: number
}
