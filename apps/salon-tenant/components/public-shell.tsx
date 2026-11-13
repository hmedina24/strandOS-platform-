import Link from "next/link";
import type { ReactNode } from "react";
import { ActionLink } from "@strandos/ui";
import type { TenantRuntime } from "../lib/tenant-runtime";

export function PublicShell({ runtime, children }: { runtime: TenantRuntime; children: ReactNode }) {
  const { configuration, navigation } = runtime;
  const bookNow = navigation.find((item) => item.path === "/book");
  const publicLinks = navigation.filter((item) => item.path !== "/book");
  return (
    <div className="tenant-app" style={{ "--brand": configuration.branding.primaryColor, "--accent": configuration.branding.accentColor } as React.CSSProperties}>
      <header className="site-header">
        <Link href="/" className="site-brand">{configuration.business.displayName}</Link>
        <div className="site-navigation"><nav aria-label="Public site"><ul>{publicLinks.map((item) => <li key={item.path}><Link href={item.path}>{item.label}</Link></li>)}</ul></nav><div className="header-actions"><ActionLink className="header-book" href={bookNow?.path ?? "/book"}>{bookNow?.label ?? "Book now"}</ActionLink><ActionLink className="header-login" href="/login" variant="secondary">Log in</ActionLink></div></div>
      </header>
      {children}
      <footer className="site-footer"><div><p>{configuration.business.displayName}</p><span>Plan your visit or get in touch.</span></div><div className="footer-hours"><h2>Hours</h2><dl>{Object.entries(configuration.business.hours).map(([day, hours]) => <div key={day}><dt>{day}</dt><dd>{hours}</dd></div>)}</dl></div><address className="footer-contact"><h2>Contact us</h2><a href={`mailto:${configuration.business.publicContactEmail}`}>{configuration.business.publicContactEmail}</a><a href={`tel:${configuration.business.publicContactPhone.e164}`}>{configuration.business.publicContactPhone.display}</a></address></footer>
    </div>
  );
}
