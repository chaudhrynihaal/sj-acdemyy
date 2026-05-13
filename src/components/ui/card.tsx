import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
        className,
      )}
      {...props}
    />
  );
}
