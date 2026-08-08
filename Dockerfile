# Base image
FROM node:20-bookworm-slim AS base
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

ARG NEXT_PUBLIC_SPPLABS_API_HOST
ARG NEXT_PUBLIC_SPPLABS_DOMAIN
ARG NEXT_PUBLIC_SPPLABS_API_KEY

ENV NEXT_PUBLIC_SPPLABS_API_HOST=${NEXT_PUBLIC_SPPLABS_API_HOST:-https://api.spplabs.es}
ENV NEXT_PUBLIC_SPPLABS_DOMAIN=${NEXT_PUBLIC_SPPLABS_DOMAIN:-jspp.es}
ENV NEXT_PUBLIC_SPPLABS_API_KEY=${NEXT_PUBLIC_SPPLABS_API_KEY}

RUN npm run build

# Runner stage
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
