import Link from "next/link";
import type { ReactNode } from "react";
import { ActionLink } from "@strandos/ui";
import type { TenantRuntime } from "../lib/tenant-runtime";

export function PublicShell({ runtime, children }: { runtime: TenantRuntime; children: ReactNode }) {
  const { configuration, navigation } = runtime;
  return (
    <div className="tenant-app" style={{ "--brand": configuration.branding.primaryColor, "--accent": configuration.branding.accentColor } as React.CSSProperties}>
      <header className="site-header">
        <Link href="/" className="site-brand">{configuration.business.displayName}</Link>
        <div className="site-navigation"><nav aria-label="Public site"><ul>{navigation.map((item) => <li key={item.path}><Link href={item.path}>{item.label}</Link></li>)}</ul></nav><ActionLink className="header-login" href="/staff" variant="secondary">Staff log in</ActionLink></div>
      </header>
      {children}
      <footer className="site-footer"><p>{configuration.business.displayName}</p><a href={`mailto:${configuration.business.publicContactEmail}`}>{configuration.business.publicContactEmail}</a></footer>
    </div>
  );
}
