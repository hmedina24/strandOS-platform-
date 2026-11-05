# StrandOS Platform

![Project status](https://img.shields.io/badge/status-foundation%20phase-6f42c1?style=flat-square)
![Platform](https://img.shields.io/badge/platform-vertical%20SaaS-1f6feb?style=flat-square)
![Mobile](https://img.shields.io/badge/mobile-iOS%20%2B%20Android-0a7f5a?style=flat-square)
![Repository](https://img.shields.io/badge/repository-private-6e7781?style=flat-square)

> The operating system for modern hair and beauty businesses.

StrandOS is a secure, web-first SaaS platform for independent hairstylists, salons, barbershops, and beauty businesses. It brings together appointment booking, client history, business operations, and practical intelligence so every business can deliver a more personal, consistent client experience.

## Product vision

Give independent beauty businesses the digital operating power of a modern multi-location brand—without requiring them to manage technology, servers, or cloud infrastructure.

Each business receives a securely isolated workspace with its own people, bookings, client records, services, payments, settings, and brand experience. StrandOS centrally manages the underlying platform, security, improvements, and provisioning.

## Core capabilities

| Area | What StrandOS provides |
| --- | --- |
| Booking and calendar | Online booking, availability, appointments, reminders, cancellations, and deposits |
| Client care | Client profiles, preferences, service history, appointment notes, and hair-journey records |
| Salon operations | Staff scheduling, services, pricing, inventory, client messaging, reporting, and calendar controls |
| Commerce | Payments, tips, receipts, deposits, and future membership or gift-card support |
| Intelligence | Rebooking signals, satisfaction trends, business performance insights, and personalized care prompts |
| Platform operations | Tenant provisioning, role-based access, data isolation, auditability, backups, and monitoring |

## Product experiences

- **Client mobile experience** *(future)* — discover services, book, pay, receive reminders, review visit history, and manage preferences.
- **Stylist and staff mobile experience** *(future)* — run the day, view appointments, review client history, record service outcomes, and follow up.
- **Owner and administrator workspace** — manage staff, schedules, services, inventory, finances, reports, permissions, and business configuration.
- **Public booking web experience** — give each business a professional online booking presence.

## Repository map

```text
.
├── apps/
│   ├── mobile/                # Client and stylist mobile experience
│   ├── admin-web/             # Owner, manager, and receptionist workspace
│   └── booking-web/           # Public booking experience
├── services/
│   └── api/                   # Modular backend API
│       ├── auth/              # Authentication and authorization
│       ├── tenants/           # Business provisioning and tenant management
│       ├── appointments/      # Booking and calendar workflows
│       ├── clients/           # Client profiles and service history
│       ├── payments/          # Deposits, payments, and receipts
│       ├── inventory/         # Product and stock management
│       ├── messaging/         # Email, SMS, and push workflows
│       └── analytics/         # Reporting and intelligence
├── packages/
│   ├── ui/                    # Shared design system and UI components
│   ├── shared-types/          # Shared API and domain contracts
│   ├── business-rules/        # Reusable salon business logic
│   ├── config/                # Shared tooling configuration
│   └── api-client/            # Typed API client
├── infrastructure/
│   ├── provisioning/          # Tenant and environment provisioning
│   ├── environments/          # Development, staging, and production settings
│   └── monitoring/            # Logging, alerts, and observability
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

### Delivery phases

```text
Phase 1 — Website MVP
Admin workspace, public booking, appointments, client history,
payments, messaging, and basic reporting.

Phase 2 — Responsive web refinement
Excellent phone-browser experience, client self-service, and richer notifications.

Phase 3 — Native mobile applications
Expo / React Native apps for iOS and Android using the existing StrandOS API.
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

Each business is a secure tenant in the StrandOS platform. Early customers receive isolated data, configuration, roles, and branding within a shared managed cloud environment; they do not receive separate cloud accounts or application codebases.

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

## Documentation

Project documentation belongs in `docs/`. Record material technical decisions in `docs/decisions/` so the reasons behind the platform's architecture remain clear as StrandOS grows.

## Project status

StrandOS is in its foundation phase. The repository currently establishes the product boundaries and engineering structure for the first salon customer.

---

Private and proprietary. © 2026 StrandOS.
