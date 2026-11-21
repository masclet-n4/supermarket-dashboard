# supermarket-front

Monolito Bun: `server/` sirve la API y el `dist` de `web/` (Vue 3 + Vite + Tailwind v4).

```text
server/   Bun.serve: /api/* y estáticos de web/dist (fallback a index.html)
web/      Vue 3 + Vite + Tailwind. Tokens del diseño en src/style.css (@theme)
design/   figcraft (la página «05 · Propuesta v3» es la versión vigente)
```

## Uso

```bash
bun install
bun run dev        # server en http://localhost:3100 (PORT) + Vite con proxy de /api
bun run build        # genera web/dist
bun run start        # sirve web/dist + /api
```

Notas para `supermarket-stats` / `supermarket-scraper`: `NOTAS-STATS-SCRAPER.md`.
