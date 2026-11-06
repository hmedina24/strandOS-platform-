import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ControlPlaneShell } from "../components/control-plane-shell";

export const metadata: Metadata = {
  title: "StrandOS Control Plane",
  description: "Operate and provision managed salon applications.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ControlPlaneShell>{children}</ControlPlaneShell>
      </body>
    </html>
  );
}
