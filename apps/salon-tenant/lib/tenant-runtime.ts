import "server-only";

import { readFileSync, existsSync } from "node:fs";
import { resolve, relative, sep } from "node:path";
import {
  type TenantConfiguration,
  validateTenantConfiguration,
} from "@strandos/tenant-configuration";

export type NavigationItem = { label: string; path: string };
export type AboutContent = {
  eyebrow: string;
  title: string;
  summary: string;
  sections: Array<{ title: string; body: string }>;
};

export type TenantRuntime = {
  configuration: TenantConfiguration;
  homepage: string;
  about: AboutContent;
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

function isNavigationItem(value: unknown): value is NavigationItem {
  return Boolean(
    value &&
      typeof value === "object" &&
      "label" in value && typeof value.label === "string" && value.label.trim() &&
      "path" in value && typeof value.path === "string" && value.path.startsWith("/"),
  );
}

function isNavigation(value: unknown): value is { items: NavigationItem[] } {
  const requiredPaths = ["/", "/services", "/about", "/book"];
  if (!value || typeof value !== "object" || !("items" in value) || !Array.isArray(value.items)) return false;
  const items = value.items as unknown[];
  if (items.length !== requiredPaths.length || !items.every(isNavigationItem)) return false;
  const navigationItems = items as NavigationItem[];
  return requiredPaths.every((path) => navigationItems.some((item) => item.path === path)) && new Set(navigationItems.map((item) => item.path)).size === navigationItems.length;
}

function isAboutContent(value: unknown): value is AboutContent {
  return Boolean(
    value &&
      typeof value === "object" &&
      "eyebrow" in value && typeof value.eyebrow === "string" && value.eyebrow.trim() &&
      "title" in value && typeof value.title === "string" && value.title.trim() &&
      "summary" in value && typeof value.summary === "string" && value.summary.trim() &&
      "sections" in value && Array.isArray(value.sections) && value.sections.length >= 3 &&
      value.sections.every((section) => section && typeof section === "object" && "title" in section && typeof section.title === "string" && section.title.trim() && "body" in section && typeof section.body === "string" && section.body.trim()),
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
    const aboutCandidate = readJson(resolveInside(contentRoot, configuration.website.content.about));
    if (!isAboutContent(aboutCandidate)) return { ok: false, errors: ["website.content.about must contain an eyebrow, title, summary, and at least three narrative sections"] };
    const navigationCandidate = readJson(resolveInside(contentRoot, configuration.website.content.navigation));
    if (!isNavigation(navigationCandidate)) return { ok: false, errors: ["website.content.navigation must contain Home, Services, About, and Book Now root-relative links"] };

    return { ok: true, runtime: { configuration, homepage, about: aboutCandidate, navigation: navigationCandidate.items } };
  } catch (error) {
    return { ok: false, errors: [error instanceof Error ? error.message : "unable to load tenant configuration"] };
  }
}
