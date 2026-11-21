import type { BunRequest } from 'bun'
import { getProductDetails, getProductHistoryPrices } from '../service/get-product-details'
import { getProducts } from '../service/get-products'
import type { ProductsRepository } from '../service/products-repository'
import type { ProductHistoryPeriod } from '../service/types/product-history'
import type { ProductStatsPeriod } from '../service/types/product-stats'
import type { ProductSearchCriteria, ProductSort } from '../service/types/product-search'
import { getTrends } from '../service/get-trends'
import {
  TRENDS_MAX_PAGE_SIZE,
  TRENDS_PAGE_SIZE,
} from '../service/types/product-trends'
import type {
  ProductTrendMetric,
  ProductTrendSortDirection,
  ProductTrendSortName,
  ProductTrendsCriteria,
} from '../service/types/product-trends'
import { getHome } from '../service/get-home'

const productHistoryPeriods: ProductHistoryPeriod[] = ['7', '30', '90', '356', 'all']
const productTrendPeriods: ProductStatsPeriod[] = ['7', '30', '90', '356']
const productSorts: ProductSort[] = [
  'referencePriceAsc',
  'packagePriceAsc',
  'packagePriceDesc',
  'biggestDecrease30d',
  'biggestIncrease30d',
]
const trendSortNames: ProductTrendSortName[] = ['priceMovement', 'priceChanges']
const trendSortDirections: ProductTrendSortDirection[] = ['ASC', 'DESC']
const trendMetrics: ProductTrendMetric[] = ['absolute', 'percent']

export default (productsRepository: ProductsRepository) => ({
  '/api/products': {
    GET: async (req: BunRequest) => withApiErrors(async () => {
      const criteria = parseAndValidateSearchQuery(req)
      if (!criteria) {
        return Response.json({ error: 'invalid_query' }, { status: 400 })
      }

      return Response.json(await getProducts(criteria, productsRepository))
    })
  },
  '/api/products/:id': {
    GET: async (req: BunRequest) => withApiErrors(async () => {
      const details = await getProductDetails(req.params.id, productsRepository)
      if (!details) {
        return Response.json({ error: 'product_not_found' }, { status: 404 })
      }

      return Response.json(details)
    })
  },
  '/api/products/:id/history': {
    GET: async (req: BunRequest) => withApiErrors(async () => {
      const period = validateHistoryPeriod(req)
      if (!period) {
        return Response.json({ error: 'invalid_query' }, { status: 400 })
      }

      return Response.json(
        await getProductHistoryPrices(req.params.id, period, productsRepository),
      )
    })
  },
  '/api/trends': {
    GET: async (req: BunRequest) => withApiErrors(async () => {
      const criteria = parseAndValidateTrendsQuery(req)
      if (!criteria) {
        return Response.json({ error: 'invalid_query' }, { status: 400 })
      }

      return Response.json(await getTrends(criteria, productsRepository))
    })
  },
  '/api/home': {
    GET: async () => withApiErrors(async () => {
      return Response.json(await getHome(productsRepository))
    })
  }
})

const parseAndValidateSearchQuery = (req: BunRequest): ProductSearchCriteria | null => {
  const params = getSearchParams(req)
  if (!params) return null

  const pageValue = params.get('page') ?? '1'
  const page = Number(pageValue)
  const q = (params.get('q') ?? '').trim()
  const sortValue = params.get('sort') ?? 'referencePriceAsc'
  const sort = productSorts.find((option) => option === sortValue)
  const supermarket = (params.get('supermarket') ?? '').trim()

  if (
    !/^[1-9]\d*$/.test(pageValue) ||
    !Number.isSafeInteger(page) ||
    !sort ||
    q.length > 100
  ) {
    return null
  }

  return { q, ...(supermarket ? { supermarket } : {}), sort, page }
}

const validateHistoryPeriod = (req: BunRequest): ProductHistoryPeriod | null => {
  const params = getSearchParams(req)
  if (!params) return null

  const value = params.get('period') ?? '30'
  return productHistoryPeriods.find((period) => period === value) ?? null
}

const parseAndValidateTrendsQuery = (req: BunRequest): ProductTrendsCriteria | null => {
  const params = getSearchParams(req)
  if (!params) return null

  const periodValue = params.get('period') ?? '30'
  const period = productTrendPeriods.find((option) => option === periodValue)
  const sortNameValue = params.get('sortName')
  const sortName = trendSortNames.find((option) => option === sortNameValue)
  const sortDirectionValue = params.get('sortDirection') ?? 'ASC'
  const sortDirection = trendSortDirections.find((option) => option === sortDirectionValue)
  const metricValue = params.get('metric')
  const metric = metricValue === null
    ? undefined
    : trendMetrics.find((option) => option === metricValue)
  const pageValue = params.get('page') ?? '1'
  const page = Number(pageValue)
  const perPageValue = params.get('perPage') ?? String(TRENDS_PAGE_SIZE)
  const perPage = Number(perPageValue)
  const supermarket = (params.get('supermarket') ?? '').trim()

  if (
    !period ||
    !sortName ||
    !sortDirection ||
    (metricValue !== null && !metric) ||
    (sortName === 'priceChanges' && metric !== undefined) ||
    !/^[1-9]\d*$/.test(pageValue) ||
    !Number.isSafeInteger(page) ||
    !/^[1-9]\d*$/.test(perPageValue) ||
    !Number.isSafeInteger(perPage) ||
    perPage > TRENDS_MAX_PAGE_SIZE
  ) {
    return null
  }

  return {
    period,
    sortName,
    sortDirection,
    ...(metric ? { metric } : {}),
    ...(supermarket ? { supermarket } : {}),
    page,
    perPage,
  }
}

const withApiErrors = async (handler: () => Promise<Response>): Promise<Response> => {
  try {
    return await handler()
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'internal_error' }, { status: 500 })
  }
}

const getSearchParams = (req: BunRequest): URLSearchParams | null => {
  try {
    return new URL(req.url).searchParams
  } catch {
    return null
  }
}
