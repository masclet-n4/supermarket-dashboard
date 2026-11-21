import { ClientResponseError } from 'pocketbase'
import { getHistoryStartDate } from '../../service/get-product-details'
import type { ProductDetailsRecord } from '../../service/types/product-details'
import type { ProductHistoryPeriod, ProductHistoryResponse } from '../../service/types/product-history'
import { PRODUCTS_PAGE_SIZE } from '../../service/types/product-search'
import type { ProductSearchCriteria, ProductSearchPage } from '../../service/types/product-search'
import { HOME_HISTORICAL_MINIMUMS_COUNT } from '../../service/types/product-home'
import type { HistoricalMinimumRecord } from '../../service/types/product-home'
import { TRENDS_PAGE_SIZE } from '../../service/types/product-trends'
import type { ProductTrendsCriteria, ProductTrendsPage } from '../../service/types/product-trends'
import type { ProductsRepository } from '../../service/products-repository'
import { getAltTrendValue, getTrendSort, getTrendSortField, getTrendStatType, getTrendValue, MAPPED_SORT, mapPeriodStats } from './utils'
import type {
  PocketBasePriceRecord,
  PocketBaseProductRecord,
  PocketBaseProductStatsRecord,
} from './types'
import { pb } from './client'

class PocketBaseProducts implements ProductsRepository {
  private productsCollection = pb.collection('products')
  private pricesCollection = pb.collection('prices')
  private statsCollection = pb.collection('products_stats')

  async search(criteria: ProductSearchCriteria): Promise<ProductSearchPage> {
    const { q, supermarket, sort, page } = criteria
    const filters: string[] = []
    const filterParams: Record<string, string> = {}

    if (q) {
      filters.push('(name ~ {:q} || brand ~ {:q})')
      filterParams.q = q
    }
    if (supermarket) {
      filters.push('supermarket_id.slug = {:supermarket}')
      filterParams.supermarket = supermarket
    }

    const filter = filters.length ? pb.filter(filters.join(' && '), filterParams) : ''
    const pbPage = await this.productsCollection.getList<PocketBaseProductRecord>(
      page,
      PRODUCTS_PAGE_SIZE,
      {
        filter,
        sort: MAPPED_SORT[sort],
        expand: 'supermarket_id, products_stats_via_product_id',
      },
    )

    return {
      items: pbPage.items.map((record) => {
        const supermarket = record.expand?.supermarket_id
        const stats = record.expand?.products_stats_via_product_id

        return {
          id: record.id,
          name: record.name ?? null,
          brand: record.brand ?? null,
          supermarket: supermarket?.slug && supermarket.name
            ? { slug: supermarket.slug, name: supermarket.name }
            : null,
          imageUrl: record.thumbnail ?? null,
          quantity: record.quantity ?? null,
          quantityUnit: record.quantity_unit ?? null,
          available: record.available ?? null,
          packagePrice: record.unit_price ?? null,
          referencePrice: record.current_price ?? null,
          deviationFromMean30dPercent: stats?.price_diff_mean_pct_d30 ?? null,
          allTimeMinimumReferencePrice: stats?.price_min_all ?? null,
          allTimeMaximumReferencePrice: stats?.price_max_all ?? null,
        }
      }),
      totalItems: pbPage.totalItems,
    }
  }

  async getProductDetailsById(id: string): Promise<ProductDetailsRecord | null> {
    let record: PocketBaseProductRecord

    try {
      record = await this.productsCollection.getOne<PocketBaseProductRecord>(id, {
        expand: 'supermarket_id, products_stats_via_product_id',
      })
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) return null
      throw error
    }

    const supermarket = record.expand?.supermarket_id
    const stats = record.expand?.products_stats_via_product_id

    return {
      product: {
        id: record.id,
        name: record.name ?? null,
        brand: record.brand ?? null,
        supermarket: supermarket?.slug && supermarket.name
          ? { slug: supermarket.slug, name: supermarket.name }
          : null,
        imageUrl: record.thumbnail ?? null,
        sourceUrl: record.source_url ?? null,
        ean: record.ean ?? null,
        available: record.available ?? null,
        quantity: record.quantity ?? null,
        quantityUnit: record.quantity_unit ?? null,
        packagePrice: record.unit_price ?? null,
        referencePrice: record.current_price ?? null,
        description: record.description ?? null,
        legalName: record.legal_name ?? null,
        origin: record.origin ?? null,
        ingredients: record.ingredients ?? null,
        allergens: record.allergens ?? null,
        allTimeMinimumReferencePrice: stats?.price_min_all ?? null,
        allTimeMaximumReferencePrice: stats?.price_max_all ?? null,
      },
      stats: {
        d7: mapPeriodStats(stats, 'd7'),
        d30: mapPeriodStats(stats, 'd30'),
        d90: mapPeriodStats(stats, 'd90'),
        d356: mapPeriodStats(stats, 'd356'),
        all: mapPeriodStats(stats, 'all'),
      },
    }
  }

  async getProductHistoryPricesById(
    id: string,
    period: ProductHistoryPeriod,
  ): Promise<ProductHistoryResponse> {
    const from = getHistoryStartDate(period)
    const filter = from === null
      ? pb.filter('product_id = {:id}', { id })
      : pb.filter('product_id = {:id} && date >= {:from}', { id, from })
    const prices = await this.pricesCollection.getFullList<PocketBasePriceRecord>({
      filter,
      sort: 'date',
    })

    return {
      period,
      points: prices.map((price) => ({
        date: price.date,
        packagePrice: price.unit_price ?? null,
        referencePrice: price.bulk_price ?? null,
      })),
    }
  }

  async getTrends(criteria: ProductTrendsCriteria): Promise<ProductTrendsPage> {
    const sortField = getTrendSortField(criteria)
    const filters = [`${sortField} != null`]
    const filterParams: Record<string, string> = {}

    if (criteria.supermarket) {
      filters.push('product_id.supermarket_id.slug = {:supermarket}')
      filterParams.supermarket = criteria.supermarket
    }

    const result = await this.statsCollection.getList<PocketBaseProductStatsRecord>(
      criteria.page,
      criteria.perPage ?? TRENDS_PAGE_SIZE,
      {
        filter: pb.filter(filters.join(' && '), filterParams),
        sort: getTrendSort(criteria),
        expand: 'product_id, product_id.supermarket_id',
      },
    )

    return {
      items: result.items.map((stats) => {
        const product = stats.expand?.product_id
        const supermarket = product?.expand?.supermarket_id

        return {
          id: product?.id ?? stats.product_id,
          name: product?.name ?? null,
          brand: product?.brand ?? null,
          supermarket: supermarket?.slug && supermarket.name
            ? { slug: supermarket.slug, name: supermarket.name }
            : null,
          imageUrl: product?.thumbnail ?? null,
          quantity: product?.quantity ?? null,
          quantityUnit: product?.quantity_unit ?? null,
          available: product?.available ?? null,
          packagePrice: product?.unit_price ?? null,
          referencePrice: product?.current_price ?? null,
          statValue: getTrendValue(stats, criteria),
          statType: getTrendStatType(criteria),
          statMetric: criteria?.metric || null,
          altValue: getAltTrendValue(stats, criteria)
        }
      }),
      totalItems: result.totalItems,
    }
  }

  async getHistoricalMinimums(): Promise<HistoricalMinimumRecord[]> {
    const result = await this.statsCollection.getList<PocketBaseProductStatsRecord>(
      1,
      HOME_HISTORICAL_MINIMUMS_COUNT,
      {
        filter: 'price_min_all < price_max_all && product_id.current_price = price_min_all',
        sort: 'price_diff_mean_pct_all',
        expand: 'product_id, product_id.supermarket_id',
      },
    )

    return result.items.flatMap((stats) => {
      const product = stats.expand?.product_id
      if (!product) return []

      const supermarket = product.expand?.supermarket_id
      return [{
        id: product.id,
        name: product.name ?? null,
        brand: product.brand ?? null,
        supermarket: supermarket?.slug && supermarket.name
          ? { slug: supermarket.slug, name: supermarket.name }
          : null,
        imageUrl: product.thumbnail ?? null,
        quantity: product.quantity ?? null,
        quantityUnit: product.quantity_unit ?? null,
        available: product.available ?? null,
        packagePrice: product.unit_price ?? null,
        referencePrice: product.current_price ?? null,
        deviationFromMean30dPercent: stats.price_diff_mean_pct_d30 ?? null,
      }]
    })
  }
}

export const productsRepository = new PocketBaseProducts()
