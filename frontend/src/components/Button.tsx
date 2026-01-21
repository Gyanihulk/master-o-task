import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../utils/cn";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald-500 text-slate-950 hover:bg-emerald-400 focus:ring-emerald-300",
  outline:
    "border border-slate-700 text-slate-100 hover:border-emerald-400 hover:text-emerald-200",
  ghost: "text-slate-200 hover:bg-slate-800/60",
  danger: "bg-rose-500 text-white hover:bg-rose-400 focus:ring-rose-300",
};

export const Button = ({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) => (
  <button
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-0",
      variantClasses[variant],
      className
    )}
    {...props}
  >
    {children}
  </button>
);
