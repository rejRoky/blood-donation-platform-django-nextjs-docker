import type { Metadata } from "next";
import { DashboardOverview } from "@/components/dashboard/overview";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <DashboardOverview />
    </div>
  );
}
