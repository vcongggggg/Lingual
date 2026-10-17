# Multi-stage Dockerfile for @linguaflow/api
FROM node:22-alpine AS base
RUN apk add --no-cache openssl && corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Stage 1: Install dependencies
FROM base AS dependencies
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages ./packages
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# Stage 2: Build API
FROM base AS builder
COPY --from=dependencies /app ./
COPY apps/api ./apps/api
COPY prisma ./prisma
RUN npx prisma generate
RUN pnpm --filter @linguaflow/api build

# Stage 3: Production Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /app ./

EXPOSE 4000
CMD ["sh", "-c", "npx prisma db push && npx tsx apps/api/src/server.ts"]
