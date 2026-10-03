import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  actions?: ReactNode;
  pad?: boolean;
}

/** Kartu antarmuka pasien — lembut, rounded-xl (design_system.md) */
export function Card({ title, actions, pad = true, className = "", children, ...rest }: CardProps) {
  return (
    <div className={`rounded-3xl border border-white/85 bg-white/75 shadow-[0_12px_32px_rgba(22,40,49,.08)] backdrop-blur-lg ${className}`} {...rest}>
      {title && (
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-5 py-3">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {actions}
        </div>
      )}
      <div className={pad ? "p-5" : ""}>{children}</div>
    </div>
  );
}
