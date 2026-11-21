/** Campos de PocketBase que usa el listado; no salen del adaptador. */
export type PocketBaseProductRecord = {
  id: string
  supermarket_id?: string | null
  name?: string | null
  brand?: string | null
  thumbnail?: string | null
  available?: boolean | null
  quantity?: number | null
  quantity_unit?: string | null
  current_price?: number | null
  unit_price?: number | null
  source_url?: string | null
  ean?: string | null
  description?: string | null
  legal_name?: string | null
  origin?: string | null
  ingredients?: string | null
  allergens?: string | null
  expand?: {
    supermarket_id?: {
      id: string
      slug?: string | null
      name?: string | null
    }
    products_stats_via_product_id?: PocketBaseProductStatsRecord
  }
}

/** Campos de products_stats que necesita la tarjeta de Productos. */
export type PocketBaseProductStatsRecord = {
  product_id: string
  mean_price_d7?: number | null
  price_diff_mean_d7?: number | null
  price_diff_mean_pct_d7?: number | null
  price_min_d7?: number | null
  price_max_d7?: number | null
  num_changes_d7?: number | null
  mean_price_d30?: number | null
  price_diff_mean_d30?: number | null
  price_diff_mean_pct_d30?: number | null
  price_min_d30?: number | null
  price_max_d30?: number | null
  num_changes_d30?: number | null
  mean_price_d90?: number | null
  price_diff_mean_d90?: number | null
  price_diff_mean_pct_d90?: number | null
  price_min_d90?: number | null
  price_max_d90?: number | null
  num_changes_d90?: number | null
  mean_price_d356?: number | null
  price_diff_mean_d356?: number | null
  price_diff_mean_pct_d356?: number | null
  price_min_d356?: number | null
  price_max_d356?: number | null
  num_changes_d356?: number | null
  mean_price_all?: number | null
  price_diff_mean_all?: number | null
  price_diff_mean_pct_all?: number | null
  price_min_all?: number | null
  price_max_all?: number | null
  num_changes_all?: number | null
  expand?: {
    product_id?: PocketBaseProductRecord
  }
}

export type PocketBasePriceRecord = {
  id: string
  product_id: string
  date: string
  bulk_price?: number | null
  unit_price?: number | null
}
