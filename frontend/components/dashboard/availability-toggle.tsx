"use client";

import { toast } from "sonner";
import { useToggleAvailability } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function AvailabilityToggle({ available }: { available: boolean }) {
  const toggle = useToggleAvailability();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={available}
      aria-label="Donor availability"
      disabled={toggle.isPending}
      onClick={() =>
        toggle.mutate(!available, {
          onSuccess: (response) => toast.success(response.message),
          onError: () => toast.error("Could not update availability."),
        })
      }
      className={cn(
        "focus-ring relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-60",
        available ? "bg-emerald-500" : "bg-slate-300",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-0.5 size-6 rounded-full bg-white shadow transition-all",
          available ? "left-[calc(100%-1.625rem)]" : "left-0.5",
        )}
      />
    </button>
  );
}
