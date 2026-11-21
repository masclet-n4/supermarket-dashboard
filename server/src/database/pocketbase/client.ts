import PocketBase from 'pocketbase'

const url = Bun.env.POCKETBASE_URL

if (!url) {
  throw new Error('POCKETBASE_URL is required')
}

export const pb = new PocketBase(url)

await pb.collection('_superusers').authWithPassword(
  Bun.env.POCKETBASE_ADMIN_EMAIL!,
  Bun.env.POCKETBASE_ADMIN_PASSWORD!,
  {
    autoRefreshThreshold: 30 * 60,
  },
)

// Evita que el SDK cancele peticiones concurrentes
// que puedan tener la misma URL.
pb.autoCancellation(false)
