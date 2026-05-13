"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";

const baseClass =
  "inline-flex items-center justify-center gap-2 font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "rounded-full bg-navy px-6 py-3 text-sm text-white shadow-md hover:scale-[1.02] hover:bg-slate-800 hover:shadow-lg active:scale-[0.99]",
  secondary:
    "rounded-lg border-2 border-amber-500 bg-white px-5 py-2.5 text-sm text-navy hover:bg-amber-50 hover:border-amber-600",
  ghost: "rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-slate-100",
};

export function buttonClass(
  variant: ButtonVariant = "primary",
  className?: string,
) {
  return cn(baseClass, variantClass[variant], className);
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", loading, disabled, children, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={buttonClass(variant, className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {children}
      </button>
    );
  },
);
