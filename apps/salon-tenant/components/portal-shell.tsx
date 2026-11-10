import Link from "next/link";
import type { ReactNode } from "react";
import type { TenantRuntime } from "../lib/tenant-runtime";

export function PortalShell({ runtime, kind, children }: { runtime: TenantRuntime; kind: "customer" | "staff"; children: ReactNode }) {
  const { configuration } = runtime;
  const staffModules = Object.entries(configuration.modules).filter(([, enabled]) => enabled).map(([module]) => module);
  const links = kind === "customer"
    ? [{ label: "My profile", path: "/customer" }, { label: "My history", path: "/customer/history" }]
    : [{ label: "Overview", path: "/staff" }, ...staffModules.map((module) => ({ label: module, path: `/staff/${module}` }))];
  return (
    <div className="portal-shell" style={{ "--brand": configuration.branding.primaryColor, "--accent": configuration.branding.accentColor } as React.CSSProperties}>
      <aside><Link href="/" className="portal-brand">{configuration.business.displayName}</Link><p>{kind === "customer" ? "Customer portal" : "Staff portal"}</p><nav aria-label={`${kind} portal`}><ul>{links.map((link) => <li key={link.path}><Link href={link.path}>{link.label}</Link></li>)}</ul></nav></aside>
      <main>{children}</main>
    </div>
  );
}
