import { cn } from "@/lib/utils";

/** Blood group chip — the visual signature of the product. */
export function BloodBadge({
  group,
  size = "md",
  className,
}: {
  group: string | null | undefined;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  if (!group) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-brand-600 font-bold text-white",
        size === "sm" && "h-7 min-w-7 px-1.5 text-xs",
        size === "md" && "h-9 min-w-9 px-2 text-sm",
        size === "lg" && "h-14 min-w-14 px-3 text-xl",
        className,
      )}
    >
      {group}
    </span>
  );
}
