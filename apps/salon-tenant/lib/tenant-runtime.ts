import "server-only";

import { readFileSync, existsSync } from "node:fs";
import { resolve, relative, sep } from "node:path";
import {
  type TenantConfiguration,
  validateTenantConfiguration,
} from "@strandos/tenant-configuration";

export type NavigationItem = { label: string; path: string };

export type TenantRuntime = {
  configuration: TenantConfiguration;
  homepage: string;
  about: string;
  navigation: NavigationItem[];
};

export type TenantRuntimeResult =
  | { ok: true; runtime: TenantRuntime }
  | { ok: false; errors: string[] };

function repositoryRoot() {
  const candidates = [process.cwd(), resolve(process.cwd(), "..", "..")];
  const root = candidates.find((candidate) =>
    existsSync(resolve(candidate, "packages", "tenant-configuration")),
  );
  return root ?? process.cwd();
}

function readJson(filePath: string): unknown {
  return JSON.parse(readFileSync(filePath, "utf8")) as unknown;
}

function resolveInside(root: string, requestedPath: string) {
  const resolved = resolve(root, requestedPath);
  const pathFromRoot = relative(root, resolved);
  if (pathFromRoot === "" || (!pathFromRoot.startsWith(`..${sep}`) && pathFromRoot !== ".." && !pathFromRoot.includes(`${sep}..${sep}`))) {
    return resolved;
  }
  throw new Error(`configuration path must remain inside the approved content root: ${requestedPath}`);
}

function markdownBody(markdown: string) {
  if (!markdown.startsWith("---")) return markdown.trim();
  const closingMarker = markdown.indexOf("\n---", 3);
  return (closingMarker === -1 ? markdown : markdown.slice(closingMarker + 4)).trim();
}

function isNavigation(value: unknown): value is { items: NavigationItem[] } {
  return Boolean(
    value &&
      typeof value === "object" &&
      "items" in value &&
      Array.isArray(value.items) &&
      value.items.every((item) =>
        item && typeof item === "object" && "label" in item && typeof item.label === "string" && "path" in item && typeof item.path === "string" && item.path.startsWith("/"),
      ),
  );
}

/**
 * Loads only operator-supplied files. Browser input is never used to select a tenant
 * or a content path. The environment is controlled by StrandOS deployment automation.
 */
export function loadTenantRuntime(): TenantRuntimeResult {
  try {
    const root = repositoryRoot();
    const configPath = process.env.STRANDOS_TENANT_CONFIG_PATH
      ? resolve(process.env.STRANDOS_TENANT_CONFIG_PATH)
      : resolve(root, "packages", "tenant-configuration", "examples", "example-salon.json");
    const contentRoot = resolve(
      process.env.STRANDOS_TENANT_CONTENT_ROOT ?? resolve(root, "templates", "salon-tenant"),
    );
    const candidate = readJson(configPath);
    const validation = validateTenantConfiguration(candidate);
    if (!validation.valid) return { ok: false, errors: validation.errors };

    const configuration = candidate as TenantConfiguration;
    const homepage = markdownBody(readFileSync(resolveInside(contentRoot, configuration.website.content.homepage), "utf8"));
    const about = markdownBody(readFileSync(resolveInside(contentRoot, configuration.website.content.about), "utf8"));
    const navigationCandidate = readJson(resolveInside(contentRoot, configuration.website.content.navigation));
    if (!isNavigation(navigationCandidate)) return { ok: false, errors: ["website.content.navigation must contain an items array of root-relative links"] };

    return { ok: true, runtime: { configuration, homepage, about, navigation: navigationCandidate.items } };
  } catch (error) {
    return { ok: false, errors: [error instanceof Error ? error.message : "unable to load tenant configuration"] };
  }
}
