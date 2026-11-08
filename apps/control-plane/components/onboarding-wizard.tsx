"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMockTenants } from "./mock-tenant-provider";

const steps = ["Business identity", "Brand", "Services", "Features", "Website", "Review and launch"];

type TenantDraft = {
  businessName: string;
  salonType: string;
  contactEmail: string;
  primaryColor: string;
  serviceSummary: string;
  calendar: boolean;
  clients: boolean;
  sales: boolean;
  inbox: boolean;
  reports: boolean;
  products: boolean;
  domain: string;
};

const initialDraft: TenantDraft = {
  businessName: "",
  salonType: "Independent stylist",
  contactEmail: "",
  primaryColor: "#5B2C6F",
  serviceSummary: "",
  calendar: true,
  clients: true,
  sales: true,
  inbox: true,
  reports: true,
  products: true,
  domain: "",
};

export function OnboardingWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [draft, setDraft] = useState(initialDraft);
  const [isLaunched, setIsLaunched] = useState(false);
  const [createdTenantName, setCreatedTenantName] = useState("");
  const { createTenant } = useMockTenants();

  const enabledFeatures = useMemo(
    () => Object.entries(draft).filter(([key, value]) => typeof value === "boolean" && value).map(([key]) => key),
    [draft],
  );

  const setField = <Key extends keyof TenantDraft>(key: Key, value: TenantDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const canAdvance = activeStep !== 0 || (draft.businessName.trim() !== "" && draft.contactEmail.trim() !== "");

  if (isLaunched) {
    return (
      <section className="launch-state" aria-live="polite">
        <p className="eyebrow">Tenant created</p>
        <h2>{createdTenantName} is ready for simulated provisioning.</h2>
        <p>
          The tenant configuration passed the shared contract validation as a mock record. No cloud resources, domains, payment accounts, or customer data have been created.
        </p>
        <div className="launch-actions">
          <Link className="button button-primary" href="/businesses">View Businesses</Link>
          <button className="button button-secondary" type="button" onClick={() => setIsLaunched(false)}>Review configuration</button>
        </div>
      </section>
    );
  }

  return (
    <section className="wizard-layout" aria-label="Salon onboarding workflow">
      <ol className="step-list">
        {steps.map((step, index) => (
          <li key={step} className={index === activeStep ? "step step-active" : index < activeStep ? "step step-complete" : "step"}>
            <span>{index + 1}</span>
            {step}
          </li>
        ))}
      </ol>
      <div className="wizard-panel">
        <p className="eyebrow">Step {activeStep + 1} of {steps.length}</p>
        <h2>{steps[activeStep]}</h2>

        {activeStep === 0 && (
          <div className="form-grid">
            <label>Business name<input value={draft.businessName} onChange={(event) => setField("businessName", event.target.value)} placeholder="e.g. Studio 27 Salon" /></label>
            <label>Business type<select value={draft.salonType} onChange={(event) => setField("salonType", event.target.value)}><option>Independent stylist</option><option>Hair salon</option><option>Barbershop</option><option>Beauty studio</option></select></label>
            <label className="full-width">Owner contact email<input type="email" value={draft.contactEmail} onChange={(event) => setField("contactEmail", event.target.value)} placeholder="owner@example.com" /></label>
          </div>
        )}

        {activeStep === 1 && (
          <div className="form-grid">
            <label>Primary brand color<input type="color" value={draft.primaryColor} onChange={(event) => setField("primaryColor", event.target.value)} /></label>
            <div className="brand-preview" style={{ backgroundColor: draft.primaryColor }}><span>{draft.businessName ? draft.businessName.slice(0, 1).toUpperCase() : "S"}</span></div>
          </div>
        )}

        {activeStep === 2 && (
          <label>Services offered<textarea value={draft.serviceSummary} onChange={(event) => setField("serviceSummary", event.target.value)} placeholder="e.g. Silk press, color, protective styles, treatments" rows={5} /></label>
        )}

        {activeStep === 3 && (
          <fieldset className="feature-grid"><legend>Select the initial salon workspace modules</legend>{["calendar", "clients", "sales", "inbox", "reports", "products"].map((feature) => (<label className="feature-toggle" key={feature}><input type="checkbox" checked={draft[feature as keyof TenantDraft] as boolean} onChange={(event) => setField(feature as keyof TenantDraft, event.target.checked as never)} /><span>{feature}</span></label>))}</fieldset>
        )}

        {activeStep === 4 && (
          <div className="form-grid"><label className="full-width">Preferred booking domain<input value={draft.domain} onChange={(event) => setField("domain", event.target.value)} placeholder="book.studio27.com" /></label><p className="form-help full-width">This is a configuration preview only. Domain verification and deployment happen in a later provisioning phase.</p></div>
        )}

        {activeStep === 5 && (
          <div className="config-preview"><p><strong>Business:</strong> {draft.businessName || "Not supplied"}</p><p><strong>Type:</strong> {draft.salonType}</p><p><strong>Domain:</strong> {draft.domain || "StrandOS subdomain pending"}</p><p><strong>Modules:</strong> {enabledFeatures.join(", ") || "None"}</p><p><strong>Provisioning state:</strong> draft → validating → provisioning → simulated deployed</p></div>
        )}

        <div className="wizard-actions">
          <button className="button button-secondary" type="button" disabled={activeStep === 0} onClick={() => setActiveStep((step) => step - 1)}>Back</button>
          {activeStep < steps.length - 1 ? <button className="button button-primary" type="button" disabled={!canAdvance} onClick={() => setActiveStep((step) => step + 1)}>Continue</button> : <button className="button button-primary" type="button" onClick={() => {
            const tenant = createTenant({
              businessName: draft.businessName.trim(),
              salonType: draft.salonType,
              contactEmail: draft.contactEmail.trim(),
              primaryColor: draft.primaryColor,
              serviceSummary: draft.serviceSummary.trim(),
              enabledFeatures,
              domain: draft.domain.trim(),
            });
            setCreatedTenantName(tenant.businessName);
            setIsLaunched(true);
          }}>Create mock tenant</button>}
        </div>
      </div>
    </section>
  );
}
