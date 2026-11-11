import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

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
