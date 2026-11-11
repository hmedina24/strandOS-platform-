# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS base

WORKDIR /workspace
RUN corepack enable

FROM base AS dependencies

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/control-plane/package.json ./apps/control-plane/package.json
COPY packages/tenant-configuration/package.json ./packages/tenant-configuration/package.json
COPY packages/ui/package.json ./packages/ui/package.json
RUN pnpm install --frozen-lockfile=false

FROM dependencies AS development

COPY . .
EXPOSE 3000
CMD ["pnpm", "--filter", "@strandos/control-plane", "dev"]

FROM dependencies AS builder

COPY . .
RUN pnpm --filter @strandos/control-plane build

FROM node:24-bookworm-slim AS production

ENV NODE_ENV=production
WORKDIR /app
RUN useradd --system --uid 1001 strandos
COPY --from=builder --chown=strandos:strandos /workspace/apps/control-plane/.next/standalone ./
COPY --from=builder --chown=strandos:strandos /workspace/apps/control-plane/.next/static ./apps/control-plane/.next/static
USER strandos
EXPOSE 3000
CMD ["node", "apps/control-plane/server.js"]
