"use client";

import { CalendarClock, Droplet, MapPin, Phone } from "lucide-react";
import { BloodBadge } from "@/components/ui/blood-badge";
import { Avatar, Card } from "@/components/ui/misc";
import type { Donor } from "@/lib/types";
import { cn, daysUntil, formatDate, fullName, initials, nextEligibleDate } from "@/lib/utils";

export function DonorCard({ donor }: { donor: Donor }) {
  const eligibleFrom = nextEligibleDate(donor.last_donation_date);
  const available = donor.is_donate && !eligibleFrom;

  return (
    <Card className="flex flex-col gap-4 p-5 transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar initials={initials(donor)} />
          <div>
            <p className="font-bold text-slate-900">{fullName(donor)}</p>
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              {donor.upazila_name ? `${donor.upazila_name}, ` : ""}
              {donor.district_name ?? "Location not set"}
            </p>
          </div>
        </div>
        <BloodBadge group={donor.blood_group} />
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Droplet className="size-3.5 text-brand-500" aria-hidden />
          {donor.donation_count} donation{donor.donation_count === 1 ? "" : "s"}
        </span>
        <span className="flex items-center gap-1">
          <CalendarClock className="size-3.5 text-brand-500" aria-hidden />
          Last: {formatDate(donor.last_donation_date)}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
            available ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500",
          )}
        >
          <span
            className={cn("size-1.5 rounded-full", available ? "bg-emerald-500" : "bg-slate-400")}
            aria-hidden
          />
          {available
            ? "Available"
            : eligibleFrom
              ? `Eligible in ${daysUntil(eligibleFrom)}d`
              : "Unavailable"}
        </span>
        <a
          href={`tel:${donor.mobile_number}`}
          className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <Phone className="size-3.5" aria-hidden />
          {donor.mobile_number}
        </a>
      </div>
    </Card>
  );
}
