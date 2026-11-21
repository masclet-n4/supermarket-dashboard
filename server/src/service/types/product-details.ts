export type ProductPeriodStatsDto = {
  meanReferencePrice: number | null
  priceDifferenceFromMean: number | null
  priceDifferenceFromMeanPercent: number | null
  minReferencePrice: number | null
  maxReferencePrice: number | null
  numChanges: number | null
}

export type ProductDetailsResponse = {
  product: {
    id: string
    name: string | null
    brand: string | null
    supermarket: { slug: string; name: string } | null
    imageUrl: string | null
    sourceUrl: string | null
    ean: string | null
    available: boolean | null
    quantity: number | null
    quantityUnit: string | null
    packagePrice: number | null
    referencePrice: number | null
    description: string | null
    legalName: string | null
    origin: string | null
    ingredients: string | null
    allergens: string | null
    isHistoricalMinimum: boolean | null
  }
  stats: {
    d7: ProductPeriodStatsDto | null
    d30: ProductPeriodStatsDto | null
    d90: ProductPeriodStatsDto | null
    d356: ProductPeriodStatsDto | null
    all: ProductPeriodStatsDto | null
  }
}

/** Datos de producto ya traducidos por el adaptador, antes del DTO público. */
export type ProductDetailsRecord = {
  product: Omit<ProductDetailsResponse['product'], 'isHistoricalMinimum'> & {
    allTimeMinimumReferencePrice: number | null
    allTimeMaximumReferencePrice: number | null
  }
  stats: ProductDetailsResponse['stats']
}
