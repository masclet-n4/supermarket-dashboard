import { expect, test } from "bun:test"
import type { BunRequest } from "bun"
import productRoutes from "../product"
import type { ProductDetailsRecord } from "../../service/types/product-details"
import type { ProductsRepository } from "../../service/products-repository"

const request = (url: string, params: Record<string, string> = {}) =>
  Object.assign(new Request(url), { params }) as unknown as BunRequest

const repository = (
  overrides: Partial<ProductsRepository> = {},
): ProductsRepository => ({
  search: async () => ({ items: [], totalItems: 0 }),
  getProductDetailsById: async () => null,
  getProductHistoryPricesById: async (_id, period) => ({ period, points: [] }),
  getTrends: async () => ({ items: [], totalItems: 0 }),
  getHistoricalMinimums: async () => [],
  ...overrides,
})

test("returns the home summary DTO", async () => {
  const response = await productRoutes(repository())["/api/home"].GET()

  expect(response.status).toBe(200)
  expect(await response.json()).toEqual({
    historicalMinimums: [],
    trends: {
      period: "30",
      movementMetric: "percent",
      biggestIncrease: [],
      biggestDecrease: [],
      mostChanges: [],
    },
  })
})

test("rejects invalid product-list parameters with 400", async () => {
  let searchCalls = 0
  const routes = productRoutes(repository({
    search: async () => {
      searchCalls++
      return { items: [], totalItems: 0 }
    },
  }))
  const get = routes["/api/products"].GET

  const invalidPage = await get(request("http://localhost/api/products?page=0"))
  const invalidSort = await get(request("http://localhost/api/products?sort=unknown"))

  expect(invalidPage.status).toBe(400)
  expect(invalidSort.status).toBe(400)
  expect(searchCalls).toBe(0)
})

test("returns product details and stats without history", async () => {
  const record: ProductDetailsRecord = {
    product: {
      id: "p1",
      name: "Milk",
      brand: null,
      supermarket: null,
      imageUrl: null,
      sourceUrl: null,
      ean: null,
      available: true,
      quantity: null,
      quantityUnit: null,
      packagePrice: 2,
      referencePrice: 1,
      description: null,
      legalName: null,
      origin: null,
      ingredients: null,
      allergens: null,
      allTimeMinimumReferencePrice: 1,
      allTimeMaximumReferencePrice: 2,
    },
    stats: { d7: null, d30: null, d90: null, d356: null, all: null },
  }
  let receivedId = ""
  const routes = productRoutes(repository({
    getProductDetailsById: async (id) => {
      receivedId = id
      return record
    },
  }))

  const response = await routes["/api/products/:id"].GET(
    request("http://localhost/api/products/p1", { id: "p1" }),
  )
  const body = await response.json()

  expect(response.status).toBe(200)
  expect(receivedId).toBe("p1")
  expect(body.product.isHistoricalMinimum).toBe(true)
  expect(body.stats.d30).toBeNull()
  expect(body.history).toBeUndefined()
})

test("returns 404 when the requested product does not exist", async () => {
  const response = await productRoutes(repository())["/api/products/:id"].GET(
    request("http://localhost/api/products/missing", { id: "missing" }),
  )

  expect(response.status).toBe(404)
  expect(await response.json()).toEqual({ error: "product_not_found" })
})

test("returns only the requested product history and passes its id and period", async () => {
  let received: [string, string] | undefined
  const routes = productRoutes(repository({
    getProductHistoryPricesById: async (id, period) => {
      received = [id, period]
      return {
        period,
        points: [{ date: "2026-11-01", packagePrice: 2, referencePrice: 4 }],
      }
    },
  }))

  const response = await routes["/api/products/:id/history"].GET(
    request("http://localhost/api/products/p1/history?period=7", { id: "p1" }),
  )

  expect(response.status).toBe(200)
  expect(received).toEqual(["p1", "7"])
  expect(await response.json()).toEqual({
    period: "7",
    points: [{ date: "2026-11-01", packagePrice: 2, referencePrice: 4 }],
  })
})

test("defaults product history to 30 days and accepts an empty history", async () => {
  let receivedPeriod: string | undefined
  const routes = productRoutes(repository({
    getProductHistoryPricesById: async (_id, period) => {
      receivedPeriod = period
      return { period, points: [] }
    },
  }))

  const response = await routes["/api/products/:id/history"].GET(
    request("http://localhost/api/products/p1/history", { id: "p1" }),
  )

  expect(response.status).toBe(200)
  expect(receivedPeriod).toBe("30")
  expect(await response.json()).toEqual({ period: "30", points: [] })
})

test("rejects an unsupported history period without querying the repository", async () => {
  let historyCalls = 0
  const routes = productRoutes(repository({
    getProductHistoryPricesById: async (_id, period) => {
      historyCalls++
      return { period, points: [] }
    },
  }))

  const response = await routes["/api/products/:id/history"].GET(
    request("http://localhost/api/products/p1/history?period=365", { id: "p1" }),
  )

  expect(response.status).toBe(400)
  expect(await response.json()).toEqual({ error: "invalid_query" })
  expect(historyCalls).toBe(0)
})

test("validates trend criteria and defaults direction to ascending", async () => {
  let received: unknown
  const routes = productRoutes(repository({
    getTrends: async (criteria) => {
      received = criteria
      return { items: [], totalItems: 0 }
    },
  }))
  const get = routes["/api/trends"].GET

  const invalidPeriod = await get(request(
    "http://localhost/api/trends?period=all&sortName=priceMovement",
  ))
  const invalidSort = await get(request(
    "http://localhost/api/trends?sortName=unknown",
  ))
  const invalidDirection = await get(request(
    "http://localhost/api/trends?sortName=priceMovement&sortDirection=sideways",
  ))
  const invalidPerPage = await get(request(
    "http://localhost/api/trends?sortName=priceMovement&perPage=51",
  ))
  const valid = await get(request(
    "http://localhost/api/trends?period=7&sortName=priceMovement&metric=percent",
  ))

  expect([
    invalidPeriod.status,
    invalidSort.status,
    invalidDirection.status,
    invalidPerPage.status,
  ]).toEqual([400, 400, 400, 400])
  expect(valid.status).toBe(200)
  expect(received).toEqual({
    period: "7",
    sortName: "priceMovement",
    sortDirection: "ASC",
    metric: "percent",
    page: 1,
    perPage: 10,
  })
  expect(await valid.json()).toMatchObject({
    period: "7",
    sortName: "priceMovement",
    sortDirection: "ASC",
    metric: "percent",
    page: 1,
    perPage: 10,
    totalPages: 0,
  })
})

test("does not accept a metric for the changes ranking", async () => {
  const response = await productRoutes(repository())["/api/trends"].GET(
    request("http://localhost/api/trends?sortName=priceChanges&metric=percent"),
  )

  expect(response.status).toBe(400)
})

test("hides repository errors behind a generic 500 response", async () => {
  const routes = productRoutes(repository({
    getProductHistoryPricesById: async () => {
      throw new Error("sensitive PocketBase response")
    },
  }))

  const response = await routes["/api/products/:id/history"].GET(
    request("http://localhost/api/products/p1/history", { id: "p1" }),
  )

  expect(response.status).toBe(500)
  expect(await response.json()).toEqual({ error: "internal_error" })
})
