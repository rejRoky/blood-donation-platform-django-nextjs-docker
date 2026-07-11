import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError } from "@/lib/api";
import { toast } from "sonner";

/**
 * Map a backend error envelope onto react-hook-form fields.
 * Unknown fields fall back to a toast so no message is ever swallowed.
 */
export function applyApiErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  knownFields: ReadonlyArray<Path<T>>,
): void {
  if (error instanceof ApiError) {
    let mappedAny = false;
    if (error.errors) {
      for (const [field, messages] of Object.entries(error.errors)) {
        if ((knownFields as readonly string[]).includes(field)) {
          setError(field as Path<T>, { type: "server", message: messages[0] });
          mappedAny = true;
        }
      }
    }
    if (!mappedAny) toast.error(error.message);
    return;
  }
  toast.error("Something went wrong. Please try again.");
}
