import type { InputHTMLAttributes } from "react";

import { cn } from "../utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className, ...props }: InputProps) => (
  <label className="flex flex-col gap-2 text-sm text-slate-200">
    {label && <span className="text-xs uppercase tracking-wide">{label}</span>}
    <input
      className={cn(
        "rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30",
        className
      )}
      {...props}
    />
  </label>
);
