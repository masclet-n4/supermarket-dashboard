import index from '../../web/dist/index.html'
import { productsRepository } from './database/pocketbase'
import productRoutes from './routes/product'

const port = Number(process.env.PORT ?? 3100)


Bun.serve({
  port,
  routes: {
    // FRONTEND
    '/': index,

    // HEALTH CHECK
    '/api/health': () => Response.json({ ok: true }),


    ...productRoutes(productsRepository)
  },
})
