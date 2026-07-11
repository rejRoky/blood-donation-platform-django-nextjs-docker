import type { Metadata } from "next";
import { Suspense } from "react";
import { DonorDirectory } from "@/components/donors/donor-directory";

export const metadata: Metadata = {
  title: "Find donors",
  description: "Search blood donors by blood group, district and upazila.",
};

export default function DonorsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Find donors</h1>
        <p className="mt-1 text-slate-500">
          Search the donor community by blood group and location.
        </p>
      </div>
      <Suspense>
        <DonorDirectory />
      </Suspense>
    </div>
  );
}
