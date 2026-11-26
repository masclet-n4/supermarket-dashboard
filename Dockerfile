FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./
COPY server/package.json server/
COPY web/package.json web/
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build && bun build --target=bun --production --root . --outdir server/build ./server/src/index.ts

FROM oven/bun:1
WORKDIR /app
ENV NODE_ENV=production PORT=3100
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/server ./server
COPY --from=build /app/web/dist ./web/dist
WORKDIR /app/server/build
USER bun
EXPOSE 3100
CMD ["bun", "server/src/index.js"]
