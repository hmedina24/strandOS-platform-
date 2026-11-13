import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export type ActionVariant = "primary" | "secondary";

type ActionBase = {
  children: ReactNode;
  className?: string;
  variant?: ActionVariant;
};

export type ActionLinkProps = ActionBase & AnchorHTMLAttributes<HTMLAnchorElement>;
export type ActionButtonProps = ActionBase & ButtonHTMLAttributes<HTMLButtonElement>;
export type EmptyStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};
export type LoadingStateProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};
export type ErrorStateProps = {
  eyebrow?: string;
  title: string;
  description: string;
  errors?: string[];
  children?: ReactNode;
};
export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";
export type StatusBadgeProps = {
  children: ReactNode;
  tone?: StatusTone;
  className?: string;
};
export type CardProps = HTMLAttributes<HTMLDivElement>;
export type StackProps = HTMLAttributes<HTMLDivElement> & { gap?: "compact" | "standard" | "spacious" };
export type NavigationListProps = {
  label: string;
  children: ReactNode;
  className?: string;
};
export type FormFieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

function actionClassName(variant: ActionVariant, className?: string) {
  return ["strandos-action", `strandos-action-${variant}`, className].filter(Boolean).join(" ");
}

/** A styled, accessible action primitive that tenant and operator applications can share. */
export function ActionLink({ children, className, variant = "primary", ...props }: ActionLinkProps) {
  return <a {...props} className={actionClassName(variant, className)}>{children}</a>;
}

export function ActionButton({ children, className, variant = "primary", type = "button", ...props }: ActionButtonProps) {
  return <button {...props} type={type} className={actionClassName(variant, className)}>{children}</button>;
}

/** A semantic no-data or not-yet-enabled state shared by platform surfaces. */
export function EmptyState({ eyebrow, title, description, children }: EmptyStateProps) {
  return <section className="strandos-empty-state"><p className="strandos-eyebrow">{eyebrow}</p><h2>{title}</h2><p>{description}</p>{children}</section>;
}

/** A polite progress announcement for work that is still in progress. */
export function LoadingState({ eyebrow, title, description }: LoadingStateProps) {
  return <section className="strandos-loading-state" aria-live="polite" role="status"><p className="strandos-eyebrow">{eyebrow ?? "Loading"}</p><h2>{title}</h2>{description && <p>{description}</p>}</section>;
}

/** An actionable error state for a page or capability boundary. */
export function ErrorState({ eyebrow = "Something needs attention", title, description, errors = [], children }: ErrorStateProps) {
  return <section className="strandos-error-state" role="alert"><p className="strandos-eyebrow">{eyebrow}</p><h2>{title}</h2><p>{description}</p>{errors.length > 0 && <ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul>}{children}</section>;
}

/** A concise, non-interactive label for lifecycle and capability state. */
export function StatusBadge({ children, className, tone = "neutral" }: StatusBadgeProps) {
  return <span className={["strandos-status-badge", `strandos-status-${tone}`, className].filter(Boolean).join(" ")}>{children}</span>;
}

/** A neutral content surface that applications theme with their own CSS tokens. */
export function Card({ children, className, ...props }: CardProps) {
  return <div {...props} className={["strandos-card", className].filter(Boolean).join(" ")}>{children}</div>;
}

/** A simple vertical layout primitive for related content. */
export function Stack({ children, className, gap = "standard", ...props }: StackProps) {
  return <div {...props} className={["strandos-stack", `strandos-stack-${gap}`, className].filter(Boolean).join(" ")}>{children}</div>;
}

/** A semantic navigation wrapper; callers supply framework-specific links. */
export function NavigationList({ label, children, className }: NavigationListProps) {
  return <nav aria-label={label}><ul className={className}>{children}</ul></nav>;
}

/** A label, hint, and error wrapper for native form controls. */
export function FormField({ label, htmlFor, hint, error, children }: FormFieldProps) {
  return <div className="strandos-form-field"><label htmlFor={htmlFor}>{label}</label>{children}{hint && <p className="strandos-form-hint">{hint}</p>}{error && <p className="strandos-form-error" role="alert">{error}</p>}</div>;
}
