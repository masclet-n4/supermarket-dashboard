import { afterAll, beforeEach, describe, expect, test } from 'bun:test'

const previousEnv = {
  POCKETBASE_URL: process.env.POCKETBASE_URL,
  POCKETBASE_EMAIL: process.env.POCKETBASE_EMAIL,
  POCKETBASE_PASSWORD: process.env.POCKETBASE_PASSWORD,
}

let loginCount = 0
let refreshCount = 0
let recordCount = 0
let sequence = 0
let failLogin = false
let loginFailureStatus = 400
let failRefresh = false
let refreshDelay = 0
const validTokens = new Set<string>()
const requests: Array<{ path: string; expand: string | null }> = []

const product = {
  id: 'product-id', name: 'Leche', supermarket_id: 'supermarket-id', current_price: 2,
  expand: {
    supermarket_id: { id: 'supermarket-id', slug: 'mercado', name: 'Mercado' },
    products_stats_via_product_id: { product_id: 'product-id', price_min_all: 1, price_max_all: 3 },
  },
}
const stat = {
  id: 'stat-id', product_id: 'product-id', price_min_all: 1, price_max_all: 3,
  price_diff_mean_pct_d30: 5,
  expand: { product_id: product },
}

function issueToken(expiresIn = 3600, note?: string) {
  const payload = { exp: Math.floor(Date.now() / 1000) + expiresIn, sequence: ++sequence, ...(note ? { note } : {}) }
  const token = `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`
  validTokens.add(token)
  return token
}

const server = Bun.serve({
  hostname: '127.0.0.1',
  port: 0,
  async fetch(request) {
    const url = new URL(request.url)
    if (url.pathname === '/api/collections/service_accounts/auth-with-password') {
      loginCount++
      const body = await request.json() as { identity?: string; password?: string }
      if (failLogin || body.identity !== 'service@example.com' || body.password !== 'test-password') {
        return Response.json({ message: 'authentication failed' }, { status: loginFailureStatus })
      }
      return Response.json({ token: issueToken(), record: { id: 'account-id', collectionName: 'service_accounts', collectionId: 'account-collection' } })
    }
    if (url.pathname === '/api/collections/service_accounts/auth-refresh') {
      refreshCount++
      if (refreshDelay) await Bun.sleep(refreshDelay)
      if (failRefresh) return Response.json({ message: 'unavailable' }, { status: 500 })
      if (!validTokens.has(request.headers.get('Authorization') ?? '')) {
        return Response.json({ message: 'not authenticated' }, { status: 404 })
      }
      return Response.json({ token: issueToken(), record: { id: 'account-id', collectionName: 'service_accounts', collectionId: 'account-collection' } })
    }
    recordCount++
    if (!validTokens.has(request.headers.get('Authorization') ?? '')) {
      return Response.json({ message: 'forbidden' }, { status: 403 })
    }
    requests.push({ path: url.pathname, expand: url.searchParams.get('expand') })
    if (url.pathname === '/api/collections/products/records/product-id') return Response.json(product)
    const items = url.pathname === '/api/collections/products/records' ? [product]
      : url.pathname === '/api/collections/products_stats/records' ? [stat]
        : url.pathname === '/api/collections/prices/records' ? [{ id: 'price-id', product_id: 'product-id', date: '2026-01-01', bulk_price: 2, unit_price: 2 }]
          : null
    if (!items) return Response.json({ message: 'not found' }, { status: 404 })
    return Response.json({ page: 1, perPage: 50, totalItems: items.length, totalPages: 1, items })
  },
})

process.env.POCKETBASE_URL = server.url.origin
process.env.POCKETBASE_EMAIL = 'service@example.com'
process.env.POCKETBASE_PASSWORD = 'test-password'
const { pb } = await import('../client')
const { productsRepository } = await import('../index')
const startupLogins = loginCount

beforeEach(async () => {
  failLogin = false
  loginFailureStatus = 400
  failRefresh = false
  refreshDelay = 0
  validTokens.clear()
  await pb.collection('service_accounts').authWithPassword('service@example.com', 'test-password')
  loginCount = refreshCount = recordCount = 0
  requests.length = 0
})

afterAll(() => {
  server.stop(true)
  for (const [name, value] of Object.entries(previousEnv)) {
    if (value === undefined) delete process.env[name]
    else process.env[name] = value
  }
})

describe('PocketBase service account', () => {
  test('logs in at startup and preserves product and supermarket expansions', async () => {
    expect(startupLogins).toBe(1)
    const page = await productsRepository.search({ q: '', sort: 'referencePriceAsc', page: 1 })
    expect(page.items[0]?.name).toBe('Leche')
    expect(page.items[0]?.supermarket).toEqual({ slug: 'mercado', name: 'Mercado' })
    expect(page.items[0]?.allTimeMinimumReferencePrice).toBe(1)
    expect(requests[0]?.expand).toBe('supermarket_id, products_stats_via_product_id')
    expect(refreshCount).toBe(1)
  })

  test('reads details, history, trends and historical minimums', async () => {
    const details = await productsRepository.getProductDetailsById('product-id')
    const history = await productsRepository.getProductHistoryPricesById('product-id', 'all')
    const trends = await productsRepository.getTrends({ period: '30', sortName: 'priceMovement', sortDirection: 'ASC', page: 1 })
    const minimums = await productsRepository.getHistoricalMinimums()
    expect(details?.product.supermarket?.name).toBe('Mercado')
    expect(history.points).toHaveLength(1)
    expect(trends.items[0]?.name).toBe('Leche')
    expect(minimums[0]?.name).toBe('Leche')
    expect(requests.filter(item => item.path.includes('products_stats')).every(item => item.expand === 'product_id, product_id.supermarket_id')).toBe(true)
  })

  test('shares verification across concurrent requests', async () => {
    refreshDelay = 20
    await Promise.all(Array.from({ length: 8 }, () => pb.collection('products').getList(1, 1)))
    expect(refreshCount).toBe(1)
    expect(recordCount).toBe(8)
    expect(loginCount).toBe(0)
  })

  test('logs in once before concurrent requests when the token is close to expiry', async () => {
    pb.authStore.save(issueToken(30), pb.authStore.record)
    await Promise.all(Array.from({ length: 8 }, () => pb.collection('products').getList(1, 1)))
    expect(loginCount).toBe(1)
    expect(refreshCount).toBe(0)
    expect(recordCount).toBe(8)
  })

  test('accepts a valid token with a base64url payload', async () => {
    let token = ''
    for (let padding = 0; padding < 3; padding++) {
      token = issueToken(3600, 'x'.repeat(padding) + '\u083e')
      if (/[-_]/.test(token.split('.')[1])) break
    }
    expect(token.split('.')[1]).toMatch(/[-_]/)
    pb.authStore.save(token, pb.authStore.record)
    await pb.collection('products').getList(1, 1)
    expect(refreshCount).toBe(1)
    expect(loginCount).toBe(0)
    expect(recordCount).toBe(1)
  })

  test('reauthenticates after revocation and sends the replacement token', async () => {
    validTokens.clear()
    const page = await productsRepository.search({ q: '', sort: 'referencePriceAsc', page: 1 })
    expect(page.items[0]?.name).toBe('Leche')
    expect(refreshCount).toBe(1)
    expect(loginCount).toBe(1)
    expect(recordCount).toBe(1)
  })

  test('does not query records when verification fails', async () => {
    failRefresh = true
    await expect(pb.collection('products').getList(1, 1)).rejects.toBeDefined()
    expect(refreshCount).toBe(1)
    expect(loginCount).toBe(0)
    expect(recordCount).toBe(0)
  })

  test('does not query records when reauthentication fails', async () => {
    validTokens.clear()
    failLogin = true
    await expect(pb.collection('products').getList(1, 1)).rejects.toBeDefined()
    expect(refreshCount).toBe(1)
    expect(loginCount).toBe(1)
    expect(recordCount).toBe(0)
  })

  test('does not mistake an authentication 404 for a missing product', async () => {
    validTokens.clear()
    failLogin = true
    loginFailureStatus = 404
    await expect(productsRepository.getProductDetailsById('product-id')).rejects.toThrow('authentication failed')
    expect(recordCount).toBe(0)
  })
})
