import { join } from 'node:path'
import { productsRepository } from './database/pocketbase'
import productRoutes from './routes/product'

const port = Number(process.env.PORT ?? 3100)
const dist = join(import.meta.dir, '../../web/dist')


Bun.serve({
  port,
  routes: {
    // HEALTH CHECK
    '/api/health': () => Response.json({ ok: true }),


    ...productRoutes(productsRepository)
  },

  // FRONTEND: archivos estáticos de Vite; cualquier otra ruta devuelve index.html
  async fetch(req) {
    const file = Bun.file(join(dist, new URL(req.url).pathname))
    return new Response(await file.exists() && !file.name?.endsWith('/') ? file : Bun.file(join(dist, 'index.html')))
  },
})
