# 04_DOCKER_TRAEFIK_CLOUDFLARED_DEPLOYMENT.md — Hosting & Deployment Overview

## 1. High-Level Hosting Architecture
Client websites built for **SPP Labs** are containerized using **Docker** and hosted on a Linux server behind **Traefik** and **Cloudflare Tunnel (`cloudflared`)**.

```
[ Visitor / Browser ] ──(HTTPS/SSL)──> [ Cloudflare Edge ] ──(Secure Tunnel)──> [ cloudflared ]
                                                                                   │
                                                                                   ▼
  [ Client Website Container ] <──(Port 3000)── [ Traefik Proxy ] <──(Internal HTTP)─┘
```

---

## 2. Infrastructure Concepts & Coding Agent Requirements

### A. Next.js Standalone Build
- The website application must be configured to output a **standalone Node server** (`output: "standalone"` in `next.config.mjs`).
- The project must include a multi-stage `Dockerfile` exposed on port `3000` to produce a lightweight, production-ready container image.

### B. Environment Variable Build Arguments
Next.js inlines `NEXT_PUBLIC_*` environment variables during build time (`npm run build`).
- **`Dockerfile` Builder Stage:** Must declare `ARG` for `NEXT_PUBLIC_SPPLABS_API_HOST`, `NEXT_PUBLIC_SPPLABS_DOMAIN`, and `NEXT_PUBLIC_SPPLABS_API_KEY`, mapping them to `ENV` before calling `npm run build`.
- **`docker-compose.yml`:** Must include `build.args` forwarding values from the server `.env` file into the build container.

### C. Container Naming & Network
- **`container_name`:** Must be set to the short domain prefix of the client website (e.g., `container_name: jspp` for `jspp.es`).
- **`networks`:** Must connect to the external `proxy` network.

### D. Traefik Reverse Proxy Integration
- Traefik acts as the internal ingress controller and reverse proxy on the host server.
- The coding agent must configure Traefik **labels** in `docker-compose.yml` (e.g., `traefik.enable=true`, `traefik.http.routers.[name].rule=Host('clientdomain.com') || Host('www.clientdomain.com')`).
- Traefik automatically discovers new client containers joining the shared `proxy` Docker network and routes domain traffic to port `3000` of the container.

---

## 3. Mandatory Deployment Assets Template

### 1. `Dockerfile`
```dockerfile
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
ENV NEXT_PUBLIC_SPPLABS_DOMAIN=${NEXT_PUBLIC_SPPLABS_DOMAIN}
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

# Note: Only copy /app/public if the repository actually contains a public/ directory
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

### 2. `docker-compose.yml`
```yaml
services:
  client-website:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - NEXT_PUBLIC_SPPLABS_API_HOST=${NEXT_PUBLIC_SPPLABS_API_HOST:-https://api.spplabs.es}
        - NEXT_PUBLIC_SPPLABS_DOMAIN=${NEXT_PUBLIC_SPPLABS_DOMAIN:-clientbusiness.com}
        - NEXT_PUBLIC_SPPLABS_API_KEY=${NEXT_PUBLIC_SPPLABS_API_KEY}
    container_name: clientdomain
    restart: always
    environment:
      - NODE_ENV=production
      - PORT=3000
      - NEXT_PUBLIC_SPPLABS_API_HOST=${NEXT_PUBLIC_SPPLABS_API_HOST:-https://api.spplabs.es}
      - NEXT_PUBLIC_SPPLABS_DOMAIN=${NEXT_PUBLIC_SPPLABS_DOMAIN:-clientbusiness.com}
      - NEXT_PUBLIC_SPPLABS_API_KEY=${NEXT_PUBLIC_SPPLABS_API_KEY}
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.clientdomain.rule=Host(`clientbusiness.com`) || Host(`www.clientbusiness.com`)"
      - "traefik.http.routers.clientdomain.entrypoints=web"
      - "traefik.http.services.clientdomain.loadbalancer.server.port=3000"

networks:
  proxy:
    external: true
```
