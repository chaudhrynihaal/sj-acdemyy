import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "amber" | "emerald" | "slate";
};

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  amber: "bg-amber-100 text-amber-800",
  emerald: "bg-emerald-100 text-emerald-800",
  slate: "bg-slate-100 text-slate-700",
};

export function Badge({
  className,
  tone = "amber",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
