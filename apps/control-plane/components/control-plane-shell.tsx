"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ActionLink, NavigationList } from "@strandos/ui";

const navigation = [
  { href: "/", label: "Overview" },
  { href: "/businesses", label: "Businesses" },
  { href: "/onboarding", label: "Onboard salon" },
  { href: "/provisioning", label: "Provisioning" },
  { href: "/monitoring", label: "Monitoring" },
  { href: "/audit-log", label: "Audit log" },
  { href: "/settings", label: "Platform settings" },
];

export function ControlPlaneShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/" aria-label="StrandOS Control Plane home">
          <span className="brand-mark">S</span>
          <span>StrandOS</span>
        </Link>
        <p className="sidebar-label">Control Plane</p>
        <NavigationList label="Platform navigation" className="nav-list">
            {navigation.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link className={isActive ? "nav-link nav-link-active" : "nav-link"} href={item.href}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
        </NavigationList>
        <div className="sidebar-footer">
          <span className="status-dot" aria-hidden="true" />
          Mock environment
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Managed salon platform</p>
            <h1>StrandOS Control Plane</h1>
          </div>
          <ActionLink href="/onboarding">Onboard salon</ActionLink>
        </header>
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
