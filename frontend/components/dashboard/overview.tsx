"use client";

import { CalendarCheck2, Droplet, HeartPulse, Pencil } from "lucide-react";
import Link from "next/link";
import { AvailabilityToggle } from "@/components/dashboard/availability-toggle";
import { DonationsSection } from "@/components/dashboard/donations-section";
import { BloodBadge } from "@/components/ui/blood-badge";
import { Button } from "@/components/ui/button";
import { Avatar, Card, Skeleton } from "@/components/ui/misc";
import { useDonations, useProfile } from "@/lib/hooks";
import { daysUntil, formatDate, fullName, initials, nextEligibleDate } from "@/lib/utils";

export function DashboardOverview() {
  const profile = useProfile();
  const donations = useDonations();

  if (profile.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!profile.data) {
    return (
      <Card className="p-8 text-center text-slate-500">
        Couldn&apos;t load your profile.{" "}
        <button className="font-semibold text-brand-700 hover:underline" onClick={() => profile.refetch()}>
          Try again
        </button>
      </Card>
    );
  }

  const user = profile.data;
  const lastDonation = donations.data?.[0]?.donation_date ?? null;
  const eligibleFrom = nextEligibleDate(lastDonation);

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar initials={initials(user)} className="size-16 text-xl" />
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {fullName(user)}
              </h1>
              <p className="text-sm text-slate-500">
                {user.mobile_number}
                {user.address_detail?.district_name &&
                  ` · ${user.address_detail.upazila_name}, ${user.address_detail.district_name}`}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                Member since {formatDate(user.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BloodBadge group={user.blood_group} size="lg" />
            <Link href="/dashboard/profile">
              <Button variant="outline" size="sm">
                <Pencil className="size-4" aria-hidden />
                Edit profile
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4 p-5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Droplet className="size-5" aria-hidden />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{donations.data?.length ?? "—"}</p>
            <p className="text-xs font-medium text-slate-500">Total donations</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <CalendarCheck2 className="size-5" aria-hidden />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">
              {eligibleFrom ? `${daysUntil(eligibleFrom)}d` : "Now"}
            </p>
            <p className="text-xs font-medium text-slate-500">
              {eligibleFrom ? `Eligible from ${formatDate(eligibleFrom.toISOString())}` : "Eligible to donate"}
            </p>
          </div>
        </Card>

        <Card className="flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <HeartPulse className="size-5" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {user.is_donate ? "Visible as available" : "Marked unavailable"}
              </p>
              <p className="text-xs font-medium text-slate-500">Donor availability</p>
            </div>
          </div>
          <AvailabilityToggle available={user.is_donate} />
        </Card>
      </div>

      {/* Donations */}
      <DonationsSection />
    </div>
  );
}
