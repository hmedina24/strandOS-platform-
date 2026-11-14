import Link from "next/link";
import type { ReactNode } from "react";
import { NavigationList } from "@strandos/ui";
import type { TenantRuntime } from "../lib/tenant-runtime";
import { customerCapabilities, staffCapabilities } from "../lib/capabilities";

export function PortalShell({
  runtime,
  kind,
  children,
}: {
  runtime: TenantRuntime;
  kind: "customer" | "staff";
  children: ReactNode;
}) {
  const { configuration } = runtime;
  const customerLinks = customerCapabilities.map((capability) => ({
    label: capability.label,
    path: `/customer/${capability.slug}`,
  }));
  const profileLink = customerLinks.find(
    (link) => link.path === "/customer/profile",
  );
  const links =
    kind === "customer"
      ? [
          ...(profileLink ? [profileLink] : []),
          { label: "Home", path: "/customer" },
          ...customerLinks.filter((link) => link !== profileLink),
        ]
      : [
          { label: "Home", path: "/staff" },
          ...staffCapabilities.map((capability) => ({
            label: capability.label,
            path: `/staff/${capability.slug}`,
          })),
        ];

  return (
    <div
      className="portal-shell"
      style={
        {
          "--brand": configuration.branding.primaryColor,
          "--accent": configuration.branding.accentColor,
        } as React.CSSProperties
      }
    >
      <aside>
        <Link href="/" className="portal-brand">
          {configuration.business.displayName}
        </Link>
        <p>{kind === "customer" ? "Customer portal" : "Staff portal"}</p>
        <NavigationList label={`${kind} portal`}>
          {links.map((link) => (
            <li key={link.path}>
              <Link href={link.path}>{link.label}</Link>
            </li>
          ))}
        </NavigationList>
      </aside>
      <main>{children}</main>
    </div>
  );
}
