# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS base

WORKDIR /workspace
RUN corepack enable

FROM base AS dependencies

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/salon-tenant/package.json ./apps/salon-tenant/package.json
COPY packages/tenant-configuration/package.json ./packages/tenant-configuration/package.json
COPY packages/ui/package.json ./packages/ui/package.json
RUN pnpm install --frozen-lockfile=false

FROM dependencies AS development

COPY . .
EXPOSE 3001
CMD ["pnpm", "--filter", "@strandos/salon-tenant", "exec", "next", "dev", "-p", "3001"]
