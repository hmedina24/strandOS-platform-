"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createMockTenantRecord, runMockTenantAction, type LifecycleRun, type MockTenant, type MockTenantInput, type TenantAction, type TenantAuditEvent } from "../lib/tenant-lifecycle";

const storageKey = "strandos-control-plane-mock-tenants-v3";
const legacyStorageKey = "strandos-control-plane-mock-tenants-v2";
type StoredMockTenantData = { tenants: MockTenant[]; auditEvents: TenantAuditEvent[]; lifecycleRuns: LifecycleRun[] };
type MockTenantContextValue = StoredMockTenantData & { isLoaded: boolean; createTenant: (input: MockTenantInput) => MockTenant; runTenantAction: (tenantId: string, action: TenantAction) => LifecycleRun | null };
const MockTenantContext = createContext<MockTenantContextValue | null>(null);

function readStoredData(): StoredMockTenantData {
  const stored = window.localStorage.getItem(storageKey) ?? window.localStorage.getItem(legacyStorageKey);
  if (!stored) return { tenants: [], auditEvents: [], lifecycleRuns: [] };
  try {
    const parsed = JSON.parse(stored) as Partial<StoredMockTenantData>;
    if (!Array.isArray(parsed.tenants) || !Array.isArray(parsed.auditEvents)) return { tenants: [], auditEvents: [], lifecycleRuns: [] };
    return { tenants: parsed.tenants, auditEvents: parsed.auditEvents, lifecycleRuns: Array.isArray(parsed.lifecycleRuns) ? parsed.lifecycleRuns : [] };
  } catch { return { tenants: [], auditEvents: [], lifecycleRuns: [] }; }
}

export function MockTenantProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredMockTenantData>({ tenants: [], auditEvents: [], lifecycleRuns: [] });
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => { const load = window.setTimeout(() => { setData(readStoredData()); setIsLoaded(true); }, 0); return () => window.clearTimeout(load); }, []);
  useEffect(() => { if (isLoaded) window.localStorage.setItem(storageKey, JSON.stringify(data)); }, [data, isLoaded]);
  const value = useMemo<MockTenantContextValue>(() => ({
    ...data, isLoaded,
    createTenant(input) { const record = createMockTenantRecord(input); setData((current) => ({ ...current, tenants: [record.tenant, ...current.tenants], auditEvents: [...record.auditEvents, ...current.auditEvents] })); return record.tenant; },
    runTenantAction(tenantId, action) {
      const tenant = data.tenants.find((candidate) => candidate.id === tenantId);
      if (!tenant || data.lifecycleRuns.some((run) => run.tenantId === tenantId && ["requested", "queued", "running"].includes(run.state))) return null;
      const retryOfRunId = action === "redeploy" ? data.lifecycleRuns.find((run) => run.tenantId === tenantId && run.state === "failed")?.id : undefined;
      const result = runMockTenantAction(tenant, action, new Date(), retryOfRunId);
      setData((current) => ({ tenants: current.tenants.map((candidate) => candidate.id === tenantId ? result.tenant : candidate), lifecycleRuns: [result.run, ...current.lifecycleRuns], auditEvents: [...result.auditEvents, ...current.auditEvents] }));
      return result.run;
    },
  }), [data, isLoaded]);
  return <MockTenantContext.Provider value={value}>{children}</MockTenantContext.Provider>;
}

export function useMockTenants() { const context = useContext(MockTenantContext); if (!context) throw new Error("useMockTenants must be used within MockTenantProvider"); return context; }
