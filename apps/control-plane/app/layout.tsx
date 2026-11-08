import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ControlPlaneShell } from "../components/control-plane-shell";
import { MockTenantProvider } from "../components/mock-tenant-provider";

export const metadata: Metadata = {
  title: "StrandOS Control Plane",
  description: "Operate and provision managed salon applications.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <MockTenantProvider>
          <ControlPlaneShell>{children}</ControlPlaneShell>
        </MockTenantProvider>
      </body>
    </html>
  );
}
