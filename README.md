# StrandOS Platform

![Project status](https://img.shields.io/badge/status-foundation%20phase-6f42c1?style=flat-square)
![Platform](https://img.shields.io/badge/platform-vertical%20SaaS-1f6feb?style=flat-square)
![Mobile](https://img.shields.io/badge/mobile-iOS%20%2B%20Android-0a7f5a?style=flat-square)
![Repository](https://img.shields.io/badge/repository-private-6e7781?style=flat-square)

> The managed cloud platform for modern hair and beauty businesses.

StrandOS provisions and operates a dedicated AWS application environment and database for each salon, while the salon manages its own content and core business. The platform supplies reusable, native business capabilities rather than requiring a salon to assemble cloud infrastructure or own application code.

## Product vision

Give independent beauty businesses the digital operating power of a modern multi-location brand—without requiring them to manage technology, servers, databases, or cloud infrastructure.

Each business receives a dedicated, securely isolated application runtime and database in the StrandOS AWS account. StrandOS centrally manages the underlying platform, security, infrastructure, backups, monitoring, upgrades, and provisioning. A tenant owns approved content, branding, services, business policies, and day-to-day operations.

## Core capabilities

| Area | What StrandOS provides |
| --- | --- |
| Public website | Branded Home, Services, About, and Book Now experiences rendered from approved tenant content |
| Customer application | Customer home, calendar, booking, profile, appointment history, messaging, and products/merchandise |
| Staff application | Staff home, calendar, booking, CRM/client log, client notes/history, messaging, products, reports, receipts, analytics, and inventory |
| Native business capabilities | StrandOS-owned contacts, scheduling, calendar, messaging, products, customer profiles, reports, and intelligence |
| Platform operations | Dedicated tenant provisioning, role-based access, tenant-isolated databases, auditability, backups, monitoring, and recovery |

## Product experiences

- **Public website** — Home, Services, About, and Book Now for a tenant's branded web presence.
- **Customer application** — home, calendar, native booking, profile and appointment history, messaging, and products/merchandise.
- **Staff and salon application** — home, calendar, booking, CRM/client log, client notes/history, messaging, products, reports, receipts, analytics, and inventory.
- **Control Plane** — StrandOS operator interface for tenant desired state, provisioning, deployment, monitoring, support, and auditability.

## Repository map

```text
.
├── apps/
│   ├── control-plane/         # StrandOS operator portal for tenants, provisioning, monitoring, and support
│   ├── mobile/                # Client and stylist mobile experience
│   ├── admin-web/             # Owner, manager, and receptionist workspace
│   └── booking-web/           # Public booking experience
├── services/
│   ├── api/                   # Modular backend API
│       ├── auth/              # Authentication and authorization
│       ├── tenants/           # Business provisioning and tenant management
│       ├── appointments/      # Booking and calendar workflows
│       ├── clients/           # Client profiles and service history
│       ├── payments/          # Deposits, payments, and receipts
│       ├── inventory/         # Product and stock management
│       ├── messaging/         # Email, SMS, and push workflows
│       └── analytics/         # Reporting and intelligence
│   └── provisioning/          # Tenant provisioning and managed deployment orchestration
├── packages/
│   ├── ui/                    # Shared design system and UI components
│   ├── shared-types/          # Shared API and domain contracts
│   ├── business-rules/        # Reusable salon business logic
│   ├── config/                # Shared tooling configuration
│   ├── api-client/            # Typed API client
│   └── tenant-sdk/            # Controlled integration layer for tenant websites
├── infrastructure/
│   ├── provisioning/          # Tenant and environment provisioning
│   ├── environments/          # Development, staging, and production settings
│   ├── monitoring/            # Logging, alerts, and observability
│   ├── tenant-standard/       # Shared-runtime tenant deployment blueprint
│   └── tenant-dedicated/      # Future dedicated-runtime deployment blueprint
├── templates/
│   └── salon-tenant/          # Blueprint for future per-salon configuration repositories
└── docs/
    ├── architecture/          # Technical architecture
    ├── product/               # Product requirements and workflows
    ├── security/              # Security and privacy standards
    └── decisions/             # Architecture decision records
```

## Technology stack

StrandOS starts as a responsive web platform. A stable API and shared data model allow native iOS and Android applications to be added later without rebuilding the business foundation.

| Layer | Selected technology | Responsibility |
| --- | --- | --- |
| Language | TypeScript | Shared language for web, backend, tooling, and tests |
| Web applications | Next.js + React | Owner/staff workspace and public booking experience |
| Backend | NestJS + Node adapter | Modular REST API and domain logic |
| API contract | REST + OpenAPI | Documented contract for web clients and future mobile apps |
| Database | PostgreSQL | Transactional business, client, appointment, and payment data |
| Data access | Prisma ORM 7 + Prisma Migrate | Type-safe data access and version-controlled migrations |
| Cache and jobs | Redis + BullMQ | Caching, rate limiting, reminders, notifications, and scheduled work |
| File storage | Amazon S3 | Client-consented photos, business assets, receipts, and exports |
| Authentication | Amazon Cognito | Authentication, sessions, password recovery, and MFA capability |
| Payments | Stripe or Square | Deposits, payments, tips, refunds, and receipts; first provider chosen around customer needs |
| Email | Amazon SES | Transactional email such as confirmations, receipts, and reminders |
| SMS | AWS End User Messaging SMS | Appointment reminders, alerts, and verification messages |
| Cloud | AWS | Secure production environment and managed platform services |
| Infrastructure | Terraform | Repeatable, version-controlled cloud infrastructure |
| CI/CD | GitHub Actions | Automated verification and deployment workflows |
| Monitoring | Sentry, OpenTelemetry, and CloudWatch | Error tracking, traces, logs, and alerts |
| Testing | Vitest + Playwright | Unit/API and web end-to-end testing |

### Delivery roadmap

```text
Phase 1 — Control Plane Foundation
Operator-facing onboarding, desired-state configuration, lifecycle visibility, and audit history. This is currently a prototype with simulated provisioning.

Phase 2 — Tenant Application Foundation
Reusable public, customer, and staff application shells; shared UI packages; configuration-driven branding and content; route and capability boundaries for every tenant application.

Phase 3 — Dedicated Tenant Infrastructure & Native Core Operations
Dedicated AWS runtime and database per tenant; native authentication, operational data, contacts, scheduling, calendar, and real Control Plane provisioning.

Phase 4 — Core Business Capabilities & Repeatable Tenant Launch
Native messaging, products/inventory, customer profiles, reports, receipts, analytics, intelligence, and a second tenant provisioned through the same controlled path.
```

### Platform architecture

```text
Next.js admin workspace + public booking site
                    │
                    ▼
          NestJS modular REST API
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   PostgreSQL     Redis         S3
        │
        ├── Cognito authentication
        ├── Stripe or Square payments
        ├── SES email and AWS SMS
        └── AWS monitoring, backups, and encryption
```

Each business is a secure tenant in the StrandOS platform. Every tenant receives its own dedicated application environment and database within the StrandOS AWS account. Tenants do not receive cloud accounts, database credentials, or copies of StrandOS application code.

### Managed tenant model

StrandOS is the managed platform; a salon receives a branded application and website without owning or maintaining its underlying technology. StrandOS owns the reusable code, dedicated tenant infrastructure, deployment automation, security updates, backups, and monitoring. A salon owns its public brand configuration, approved content, business policies, and day-to-day core business operations.

```text
Salon configuration and content
            │
            ▼
StrandOS Control Plane → Provisioning Service → Dedicated tenant AWS environment
                                              ├── Branded public website
                                              ├── Customer and staff applications
                                              ├── Native StrandOS capabilities
                                              ├── Secure StrandOS API access
                                              └── Dedicated tenant database
```

The `templates/salon-tenant/` directory is the in-repository starter blueprint for future tenant repositories. Once the contract is stable, it can be published as the private `strandos-salon-template` GitHub template repository.

## Engineering principles

- **Secure by design:** isolate tenant data, apply role-based access, encrypt sensitive information, and maintain audit trails.
- **Web first, mobile-ready:** deliver the desktop and responsive browser product first; preserve a stable API for future iOS and Android apps.
- **Modular by default:** begin with a well-structured API; introduce independently deployed services only when justified by real scale or ownership needs.
- **Human-centered intelligence:** use business data to create clear, timely recommendations—not dashboards without action.
- **Privacy-respecting:** treat client profiles, appointment notes, and photos as sensitive data; collect and use them only with appropriate consent.

## Local configuration

1. Copy `.env.example` to `.env`.
2. Replace placeholder values with local development credentials.
3. Never commit `.env` files, production credentials, customer data, or client photos.

## Control Plane development

The StrandOS Control Plane runs locally in Docker with hot reload enabled. Start Docker Desktop, then run:

```text
docker compose up --build
```

Open `http://localhost:3000`. Source changes under `apps/control-plane/app/` and `apps/control-plane/components/` update the development server without rebuilding the image. Rebuild when dependencies, Docker configuration, or the Dockerfile changes.

## Documentation

Project documentation belongs in `docs/`. Record material technical decisions in `docs/decisions/` so the reasons behind the platform's architecture remain clear as StrandOS grows.

## Project status

StrandOS is in its foundation phase. The repository currently establishes the product boundaries and engineering structure for the first salon customer.

---

Private and proprietary. © 2026 StrandOS.
