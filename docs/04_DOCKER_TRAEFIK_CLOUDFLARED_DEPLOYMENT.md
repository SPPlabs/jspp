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

### B. Traefik Reverse Proxy Integration
- Traefik acts as the internal ingress controller and reverse proxy on the host server.
- The coding agent only needs to configure Traefik **labels** in the client website's `docker-compose.yml` (such as `traefik.enable=true` and `traefik.http.routers.[name].rule=Host(...)`).
- Traefik automatically discovers new client containers joining the shared `proxy` Docker network and routes domain traffic to port `3000` of the container.

### C. Cloudflare Tunnel (`cloudflared`)
- `cloudflared` runs on the server as an outbound daemon connected to Cloudflare Edge.
- No public inbound HTTP/HTTPS ports (80/443) are exposed on the host firewall.
- Cloudflare handles SSL/TLS termination, DDoS protection, and DNS routing at the edge, forwarding traffic internally through the tunnel to Traefik.

---

## 3. What the Coding Agent Must Implement

When generating a client website repository, the coding agent must ensure the following 3 deployment assets are present:

1. **`next.config.mjs`**: Containing `output: "standalone"`.
2. **`Dockerfile`**: A multi-stage build targeting `node:20-bookworm-slim` that copies `.next/standalone` and exposes port `3000`.
3. **`docker-compose.yml`**: A Compose file defining the client website service connected to the external `proxy` network with the appropriate Traefik routing labels for the client's domain.
