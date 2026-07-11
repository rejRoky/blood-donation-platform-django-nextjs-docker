"use client";

import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { DonorCard } from "@/components/donors/donor-card";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/field";
import { EmptyState, Skeleton } from "@/components/ui/misc";
import { BLOOD_GROUPS } from "@/lib/config";
import { useDistricts, useDonors, useUpazilas } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

export function DonorDirectory() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = {
    blood_group: searchParams.get("blood_group") ?? "",
    district_id: searchParams.get("district_id") ?? "",
    upazila_id: searchParams.get("upazila_id") ?? "",
    page: Math.max(1, Number(searchParams.get("page")) || 1),
  };

  const districts = useDistricts();
  const upazilas = useUpazilas(filters.district_id || undefined);
  const donors = useDonors(filters);

  const setParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const hasFilters = Boolean(filters.blood_group || filters.district_id || filters.upazila_id);
  const totalPages = donors.data ? Math.max(1, Math.ceil(donors.data.count / PAGE_SIZE)) : 1;

  return (
    <div className="space-y-8">
      {/* Blood group chips */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by blood group">
        {BLOOD_GROUPS.map((group) => {
          const active = filters.blood_group === group;
          return (
            <button
              key={group}
              type="button"
              aria-pressed={active}
              onClick={() => setParams({ blood_group: active ? "" : group, page: "" })}
              className={cn(
                "focus-ring h-10 min-w-14 rounded-full border px-4 text-sm font-bold transition-colors",
                active
                  ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                  : "border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:text-brand-700",
              )}
            >
              {group}
            </button>
          );
        })}
      </div>

      {/* Location filters */}
      <div className="grid gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <SelectField
          label="District"
          placeholder={districts.isLoading ? "Loading…" : "All districts"}
          value={filters.district_id}
          onChange={(event) => setParams({ district_id: event.target.value, upazila_id: "", page: "" })}
          options={(districts.data ?? []).map((district) => ({
            value: String(district.id),
            label: `${district.name} (${district.bn_name})`,
          }))}
        />
        <SelectField
          label="Upazila"
          placeholder={!filters.district_id ? "Select district first" : "All upazilas"}
          disabled={!filters.district_id}
          value={filters.upazila_id}
          onChange={(event) => setParams({ upazila_id: event.target.value, page: "" })}
          options={(upazilas.data ?? []).map((upazila) => ({
            value: String(upazila.id),
            label: `${upazila.name} (${upazila.bn_name})`,
          }))}
        />
        <Button
          variant="ghost"
          onClick={() => router.replace(pathname, { scroll: false })}
          disabled={!hasFilters}
          className="justify-self-start sm:justify-self-auto"
        >
          <RotateCcw className="size-4" aria-hidden />
          Reset
        </Button>
      </div>

      {/* Results */}
      {donors.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : donors.isError ? (
        <EmptyState
          title="Couldn't load donors"
          description="Something went wrong while fetching the donor list. Please try again."
          action={
            <Button variant="outline" onClick={() => donors.refetch()}>
              Try again
            </Button>
          }
        />
      ) : donors.data && donors.data.results.length > 0 ? (
        <>
          <p className="text-sm text-slate-500" aria-live="polite">
            <span className="font-semibold text-slate-800">{donors.data.count}</span>{" "}
            donor{donors.data.count === 1 ? "" : "s"} found
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {donors.data.results.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-4" aria-label="Pagination">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page <= 1 || donors.isFetching}
                onClick={() => setParams({ page: String(filters.page - 1) })}
              >
                <ChevronLeft className="size-4" aria-hidden />
                Previous
              </Button>
              <span className="text-sm font-medium text-slate-600">
                Page {filters.page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page >= totalPages || donors.isFetching}
                onClick={() => setParams({ page: String(filters.page + 1) })}
              >
                Next
                <ChevronRight className="size-4" aria-hidden />
              </Button>
            </nav>
          )}
        </>
      ) : (
        <EmptyState
          title="No donors match these filters"
          description="Try a nearby district or clear some filters — new donors join every day."
          action={
            hasFilters ? (
              <Button variant="outline" onClick={() => router.replace(pathname, { scroll: false })}>
                Clear all filters
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
