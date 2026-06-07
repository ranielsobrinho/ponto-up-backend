FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/server/package.json apps/server/
COPY packages/ packages/

RUN npm ci

COPY . .

WORKDIR /app/apps/server
RUN /app/node_modules/.bin/tsup --config tsup.config.ts

FROM node:22-alpine
WORKDIR /app

RUN addgroup --system --gid 1001 app && \
    adduser --system --uid 1001 app

COPY package.json package-lock.json ./
COPY apps/server/package.json apps/server/
COPY packages/ packages/
RUN npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force

COPY --from=builder /app/apps/server/dist ./dist

USER app

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "dist/main/server.mjs"]
