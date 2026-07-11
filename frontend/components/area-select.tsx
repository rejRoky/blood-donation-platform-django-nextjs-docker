"use client";

import { SelectField } from "@/components/ui/field";
import { useDistricts, useUpazilas } from "@/lib/hooks";

interface AreaSelectProps {
  districtValue?: number | string;
  districtProps: React.SelectHTMLAttributes<HTMLSelectElement> & { ref?: React.Ref<HTMLSelectElement> };
  upazilaProps: React.SelectHTMLAttributes<HTMLSelectElement> & { ref?: React.Ref<HTMLSelectElement> };
  districtError?: string;
  upazilaError?: string;
  required?: boolean;
}

/** Dependent district → upazila pair used by the register and profile forms. */
export function AreaSelect({
  districtValue,
  districtProps,
  upazilaProps,
  districtError,
  upazilaError,
  required,
}: AreaSelectProps) {
  const districts = useDistricts();
  const upazilas = useUpazilas(districtValue || undefined);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SelectField
        label="District"
        required={required}
        placeholder={districts.isLoading ? "Loading districts…" : "Select district"}
        error={districtError}
        options={(districts.data ?? []).map((district) => ({
          value: district.id,
          label: `${district.name} (${district.bn_name})`,
        }))}
        {...districtProps}
      />
      <SelectField
        label="Upazila"
        required={required}
        placeholder={
          !districtValue
            ? "Select district first"
            : upazilas.isLoading
              ? "Loading upazilas…"
              : "Select upazila"
        }
        disabled={!districtValue}
        error={upazilaError}
        options={(upazilas.data ?? []).map((upazila) => ({
          value: upazila.id,
          label: `${upazila.name} (${upazila.bn_name})`,
        }))}
        {...upazilaProps}
      />
    </div>
  );
}
