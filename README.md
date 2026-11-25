# supermarket-front

Monolito Bun: `server/` sirve la API y el `dist` de `web/` (Vue 3 + Vite + Tailwind v4).

```text
server/   Bun.serve: /api/* y estáticos de web/dist (fallback a index.html)
web/      Vue 3 + Vite + Tailwind. Tokens del diseño en src/style.css (@theme)
design/   figcraft (la página «05 · Propuesta v3» es la versión vigente)
```

## Configuración

El backend usa `POCKETBASE_URL`, `POCKETBASE_EMAIL` y `POCKETBASE_PASSWORD` para
acceder con la cuenta técnica de `service_accounts`. Configura las credenciales
solo en el entorno del servidor o Portainer; nunca en `web/` ni en Git. La API
pública del backend sigue siendo de lectura.

## Uso

```bash
bun install
bun run dev        # server en http://localhost:3100 (PORT) + Vite con proxy de /api
bun run build        # genera web/dist
bun run start        # sirve web/dist + /api
```

Notas para `supermarket-stats` / `supermarket-scraper`: `NOTAS-STATS-SCRAPER.md`.
