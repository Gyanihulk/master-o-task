import type { ReactNode } from "react";

import { cn } from "../utils/cn";

interface CardProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Card = ({
  title,
  description,
  action,
  children,
  className,
}: CardProps) => (
  <section
    className={cn(
      "rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-[0_0_40px_rgba(15,23,42,0.6)]",
      className
    )}
  >
    {(title || action) && (
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          {title && (
            <h2 className="font-display text-lg text-slate-100">{title}</h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-slate-400">{description}</p>
          )}
        </div>
        {action}
      </div>
    )}
    {children}
  </section>
);
