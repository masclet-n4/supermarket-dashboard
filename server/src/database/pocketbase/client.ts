import PocketBase, { ClientResponseError } from 'pocketbase'

const url = Bun.env.POCKETBASE_URL
const email = Bun.env.POCKETBASE_EMAIL
const password = Bun.env.POCKETBASE_PASSWORD

if (!url) throw new Error('POCKETBASE_URL is required')
if (!email || !password) throw new Error('POCKETBASE_EMAIL and POCKETBASE_PASSWORD are required')

export const pb = new PocketBase(url)
pb.autoCancellation(false)

const tokenExpiresSoon = () => {
  try {
    const parts = pb.authStore.token.split('.')
    if (parts.length !== 3 || parts.some((part) => !part)) return true
    // The payload only schedules renewal; PocketBase validates the token.
    const { exp } = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
    return typeof exp !== 'number' || !Number.isFinite(exp) || exp * 1000 <= Date.now() + 60_000
  } catch {
    return true
  }
}

const login = async () => {
  try {
    await pb.collection('service_accounts').authWithPassword(email, password)
  } catch {
    // An authentication 404 must not look like a missing product to callers.
    throw new Error('PocketBase service account authentication failed')
  }
  if (tokenExpiresSoon()) throw new Error('PocketBase did not return a valid token')
}

const verifySession = async () => {
  if (tokenExpiresSoon()) return login()
  try {
    await pb.collection('service_accounts').authRefresh()
    if (tokenExpiresSoon()) throw new Error('PocketBase did not return a valid token')
  } catch (error) {
    if (!(error instanceof ClientResponseError) || ![401, 403, 404].includes(error.status)) throw error
    await login()
  }
}

let pendingVerification: Promise<void> | undefined
const ensureSession = () => {
  if (!pendingVerification) {
    pendingVerification = verifySession().finally(() => { pendingVerification = undefined })
  }
  return pendingVerification
}

await login()

pb.beforeSend = async (requestUrl, options) => {
  if (requestUrl.endsWith('/api/collections/service_accounts/auth-with-password') ||
      requestUrl.endsWith('/api/collections/service_accounts/auth-refresh')) {
    return { url: requestUrl, options }
  }

  // ponytail: one server-side session check per PocketBase request; reassess load before caching verification.
  await ensureSession()
  options.headers = { ...options.headers, Authorization: pb.authStore.token }
  return { url: requestUrl, options }
}
