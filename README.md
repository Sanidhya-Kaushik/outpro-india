# Outpro.India — Corporate Digital Presence Platform

> Live Site: https://outpro-india-nine.vercel.app/  

A full-stack production platform for Outpro India's corporate web presence — built with Next.js 14, a Node.js/Express REST API, and deployed on Vercel + AWS ECS Fargate.

---

## Overview

Outpro.India is a monorepo containing:

| Package | Description |
|---|---|
| `/` (root) | **Frontend** — Next.js 14 App Router, SSG + ISR, Tailwind CSS, TypeScript |
| `outpro-backend/` | **REST API** — Express, PostgreSQL (Supabase), JWT + TOTP MFA, 36 endpoints |
| `outpro-mongo/` | **MongoDB layer** — Mongoose schemas (alternative/Phase 2 DB layer) |
| `outpro-devops/` | **Infrastructure** — Terraform (AWS ECS + VPC), GitHub Actions CI/CD |

---

## Tech Stack

**Frontend**
- [Next.js 14](https://nextjs.org/) (App Router, SSG + ISR)
- TypeScript 5, Tailwind CSS v3
- Zustand (state), TanStack Query v5 (server state)
- React Hook Form + Zod (forms & validation)
- Framer Motion (animations)
- Sanity CMS (content)

**Backend**
- Node.js 20, Express
- PostgreSQL 16 via Supabase
- JWT (HS256) + TOTP MFA (speakeasy)
- Upstash Redis (rate limiting)
- Resend (transactional email)
- Vitest (testing)

**Infrastructure**
- Vercel (frontend hosting, Mumbai edge)
- AWS ECS Fargate (API, ap-south-1)
- Cloudflare (WAF, DDoS, CDN)
- Terraform (IaC)
- GitHub Actions (CI/CD with OIDC)

---

## Project Structure

```
OutproIndia/
├── src/                          # Next.js frontend
│   ├── app/
│   │   ├── (public)/             # Public-facing pages (SSG/ISR)
│   │   │   ├── page.tsx          # Home
│   │   │   ├── about/
│   │   │   ├── services/[slug]/
│   │   │   ├── portfolio/[slug]/
│   │   │   ├── testimonials/
│   │   │   └── contact/
│   │   ├── (admin)/              # Protected admin panel (CSR + JWT)
│   │   │   ├── login/
│   │   │   └── admin/
│   │   │       ├── dashboard/
│   │   │       ├── leads/
│   │   │       ├── media/
│   │   │       ├── audit-log/
│   │   │       └── settings/
│   │   └── api/                  # Next.js API routes (BFF/proxy)
│   ├── components/
│   │   ├── ui/                   # Design system atoms
│   │   ├── layout/               # Navbar, Footer, AdminSidebar
│   │   ├── sections/             # Page-level section components
│   │   └── admin/                # Admin panel components
│   ├── lib/api/                  # Typed API client modules
│   ├── hooks/                    # Custom React hooks
│   ├── store/                    # Zustand stores (auth, toast, ui)
│   ├── types/                    # TypeScript types
│   └── validators/               # Zod schemas
│
├── outpro-backend/               # Express REST API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/               # Parameterised SQL data-access
│   │   ├── routes/               # All 36 endpoints
│   │   ├── services/             # Email, CRM, ISR, Storage
│   │   └── validators/           # Zod request schemas
│   └── migrations/               # SQL migration files
│
├── outpro-mongo/                 # MongoDB/Mongoose layer (Phase 2)
│   └── src/models/               # AdminUser, ContactLead, AuditLog, ...
│
└── outpro-devops/                # Infrastructure & CI/CD
    ├── terraform/                # AWS VPC, ECS, monitoring, DNS/SSL
    ├── github-actions/           # Backend, frontend, Terraform workflows
    └── scripts/                  # Rollback, backup, secret rotation
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 20.0.0
- pnpm ≥ 9
- PostgreSQL 16 (or a Supabase account)
- Docker + Docker Compose (optional, for local DB)

### Frontend (Next.js)

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SANITY_PROJECT_ID, etc.

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Backend (API)

```bash
cd outpro-backend
pnpm install

# Configure environment
cp .env.example .env.local
# Set DATABASE_URL, JWT_SECRET, RECAPTCHA_SECRET_KEY, etc.

# Start Postgres + Redis
docker compose up postgres redis -d

# Run migrations
pnpm migrate

# Start dev server
pnpm dev
```

API runs at `http://localhost:5000/api/v1`.

---

## Environment Variables

### Frontend (`.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API base URL |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | Sanity dataset (e.g. `production`) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | ✅ | Google reCAPTCHA v3 site key |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | ❌ | Google Analytics |
| `JWT_SECRET` | ✅ | Min 64 chars — used by Next.js middleware |
| `REVALIDATION_SECRET` | ✅ | Min 32 chars — for Sanity ISR webhook |
| `SANITY_API_TOKEN` | ✅ | Server-side Sanity reads |
| `SUPABASE_URL` | ✅ | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key |

### Backend (`outpro-backend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection URL |
| `JWT_SECRET` | ✅ | Min 64 chars (`openssl rand -hex 64`) |
| `RECAPTCHA_SECRET_KEY` | ✅ | Google reCAPTCHA v3 secret |
| `REVALIDATION_SECRET` | ✅ | Min 32 chars |
| `RESEND_API_KEY` | ✅ | Resend transactional email |
| `SUPABASE_URL` | ✅ | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key |
| `HUBSPOT_API_KEY` | ❌ | CRM sync (optional) |
| `UPSTASH_REDIS_REST_URL` | ❌ | Rate limiting (falls back to in-memory) |

---

## Pages & Routes

### Public Pages

| Route | Rendering | Description |
|---|---|---|
| `/` | SSG + ISR (1h) | Home — hero, stats, services, portfolio, testimonials |
| `/about` | SSG | Team, values, awards |
| `/services` | SSG | All services overview |
| `/services/[slug]` | SSG + ISR (on-demand) | Service detail page |
| `/portfolio` | SSG + ISR (30min) | Portfolio grid |
| `/portfolio/[slug]` | SSG + ISR (on-demand) | Case study |
| `/testimonials` | SSG + ISR (1h) | Client testimonials |
| `/contact` | SSG shell + CSR | Contact form |

### Admin Panel (JWT-protected)

| Route | Access | Description |
|---|---|---|
| `/login` | Public | Admin login with TOTP MFA |
| `/admin/dashboard` | All roles | KPI overview |
| `/admin/leads` | All roles | Contact lead management |
| `/admin/media` | Editor+ | Media library |
| `/admin/audit-log` | All roles | Immutable audit trail |
| `/admin/settings` | All roles | Profile, password, MFA |

---

## API Reference

**36 endpoints** across 6 resource groups. Full base URL: `https://www.outpro.india/api/v1`

All responses follow a standard envelope:
```json
{ "success": true, "data": { ... }, "meta": { "requestId": "uuid", "timestamp": "ISO8601" } }
```

Key endpoint groups:

| Group | Endpoints | Auth |
|---|---|---|
| Auth | Login, logout, MFA setup/verify, profile, password change | Public / JWT |
| Contact | Submit form, list/get/update/delete leads, stats | Public / JWT |
| Portfolio | CRUD projects, categories, ISR revalidation | Public / JWT |
| Testimonials | CRUD testimonials, drag reorder | Public / JWT |
| Admin | Dashboard KPIs, user management, media, audit log | JWT |
| Health | `GET /health` | Public |

Full endpoint index is documented in `outpro-backend/README.md`.

---

## Authentication

- **JWT HS256** stored in an HttpOnly, Secure, SameSite=Strict cookie
- **TOTP MFA** via speakeasy (Google Authenticator compatible)
- **Brute-force protection** — exponential backoff lockout after 5 failed attempts
- **Session revocation** — per-JTI tracking; all sessions invalidated on password change
- **Rate limiting** — 10 req/min per IP on all auth endpoints

### Role Permission Matrix

| Capability | super_admin | editor | viewer |
|---|---|---|---|
| View leads | ✅ | ✅ | ✅ |
| Update lead status | ✅ | ✅ | ❌ |
| Delete leads | ✅ | ❌ | ❌ |
| Create/update portfolio & testimonials | ✅ | ✅ | ❌ |
| Delete portfolio & testimonials | ✅ | ❌ | ❌ |
| Upload media | ✅ | ✅ | ❌ |
| Manage admin users | ✅ | ❌ | ❌ |
| View audit log | ✅ | ✅ (redacted IPs) | ✅ (redacted IPs) |

---

## Testing

```bash
# Backend tests
cd outpro-backend
pnpm test              # Run all tests (Vitest)
pnpm test:coverage     # With coverage report
```

Tests are split into unit tests (validators, utils), middleware tests, and integration tests (full Express app with mocked DB). Coverage thresholds: lines 70%, functions 70%, branches 65%.

---

## Deployment

### Frontend — Vercel

```bash
# The GitHub Actions workflow handles deploys on push to main
# Manual deploy:
vercel --prod
```

### Backend — AWS ECS Fargate

```bash
# Docker build
docker build --target runner -t outpro-india-api:latest ./outpro-backend

# CI/CD via GitHub Actions (backend-deploy.yml):
# lint → typecheck → test → Docker build → ECR push → ECS rolling deploy
```

### Infrastructure (Terraform)

```bash
cd outpro-devops/terraform
terraform init
terraform workspace new production
terraform plan -var-file=envs/production/terraform.tfvars
terraform apply -var-file=envs/production/terraform.tfvars
```

See `outpro-devops/README.md` for the full first-time setup guide including AWS OIDC configuration and GitHub secrets.

---

## Architecture

```
Cloudflare (WAF · DDoS · CDN)
        │                   │
  Vercel (Frontend)    AWS ALB (API)
  Next.js SSG/ISR      ap-south-1
  Mumbai edge               │
                     ECS Fargate
                     Node.js API
                      (2–6 tasks)
                        │       │
                  Supabase    AWS Secrets
                  PostgreSQL  Manager
                  + Storage
```

**Estimated monthly cost:** ~$207/month (Vercel Pro + ECS + ALB + Supabase Pro + Cloudflare Pro).

---

## Security

- Cloudflare WAF + DDoS protection at the edge
- Helmet CSP, XSS sanitisation (DOMPurify) at the app layer
- Parameterised SQL queries only — no string interpolation
- HttpOnly cookies, constant-time comparisons, no user enumeration
- File uploads validated by magic bytes (not extension) via `file-type`
- Trivy vulnerability scanning on every Docker image build
- CodeQL SAST on every PR merge
- No long-lived AWS keys — GitHub Actions uses OIDC role assumption

---

## License

Proprietary — Outpro.India © 2026. All rights reserved.
