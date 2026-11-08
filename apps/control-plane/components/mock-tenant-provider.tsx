"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createMockTenantRecord, type MockTenant, type MockTenantInput, type TenantAuditEvent } from "../lib/tenant-lifecycle";

const storageKey = "strandos-control-plane-mock-tenants-v1";

type StoredMockTenantData = {
  tenants: MockTenant[];
  auditEvents: TenantAuditEvent[];
};

type MockTenantContextValue = StoredMockTenantData & {
  isLoaded: boolean;
  createTenant: (input: MockTenantInput) => MockTenant;
};

const MockTenantContext = createContext<MockTenantContextValue | null>(null);

function readStoredData(): StoredMockTenantData {
  const stored = window.localStorage.getItem(storageKey);
  if (!stored) return { tenants: [], auditEvents: [] };

  try {
    const parsed = JSON.parse(stored) as StoredMockTenantData;
    if (!Array.isArray(parsed.tenants) || !Array.isArray(parsed.auditEvents)) return { tenants: [], auditEvents: [] };
    return parsed;
  } catch {
    return { tenants: [], auditEvents: [] };
  }
}

export function MockTenantProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredMockTenantData>({ tenants: [], auditEvents: [] });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadStoredData = window.setTimeout(() => {
      setData(readStoredData());
      setIsLoaded(true);
    }, 0);

    return () => window.clearTimeout(loadStoredData);
  }, []);

  useEffect(() => {
    if (isLoaded) window.localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data, isLoaded]);

  const value = useMemo<MockTenantContextValue>(() => ({
    ...data,
    isLoaded,
    createTenant(input) {
      const record = createMockTenantRecord(input);
      setData((current) => ({
        tenants: [record.tenant, ...current.tenants],
        auditEvents: [...record.auditEvents, ...current.auditEvents],
      }));
      return record.tenant;
    },
  }), [data, isLoaded]);

  return <MockTenantContext.Provider value={value}>{children}</MockTenantContext.Provider>;
}

export function useMockTenants() {
  const context = useContext(MockTenantContext);
  if (!context) throw new Error("useMockTenants must be used within MockTenantProvider");
  return context;
}
