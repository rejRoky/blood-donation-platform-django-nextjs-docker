import { HeartHandshake, ShieldCheck, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/misc";
import { DONATION_INTERVAL_DAYS, SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description: `What ${SITE.name} is and how it connects blood donors with people in need.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">About {SITE.name}</h1>
      <p className="mt-3 text-lg leading-relaxed text-slate-600">
        {SITE.name} is a community platform that connects voluntary blood donors with patients
        and their families across Bangladesh — quickly, safely, and free of charge.
      </p>

      <div className="mt-10 space-y-6">
        <Card className="flex gap-4 p-6">
          <Users className="size-6 shrink-0 text-brand-600" aria-hidden />
          <div>
            <h2 className="font-bold text-slate-900">A donor community, not a blood bank</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Donors register with their blood group, district and upazila. When someone needs
              blood, they search the directory and contact matching donors directly — no
              middleman, no fees.
            </p>
          </div>
        </Card>

        <Card className="flex gap-4 p-6">
          <ShieldCheck className="size-6 shrink-0 text-brand-600" aria-hidden />
          <div>
            <h2 className="font-bold text-slate-900">Privacy and safety by design</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Donor contact details are only visible to signed-in members. The platform enforces
              a {DONATION_INTERVAL_DAYS}-day interval between recorded donations, in line with
              standard whole-blood donation guidance, and donors can mark themselves unavailable
              at any time.
            </p>
          </div>
        </Card>

        <Card className="flex gap-4 p-6">
          <HeartHandshake className="size-6 shrink-0 text-brand-600" aria-hidden />
          <div>
            <h2 className="font-bold text-slate-900">Run by volunteers, powered by donors</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Every profile on this platform belongs to someone who chose to give. Registering
              takes a minute, and one donation can save up to three lives.
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-10 text-center">
        <Link href="/register">
          <Button size="lg">Join as a donor</Button>
        </Link>
      </div>
    </div>
  );
}
