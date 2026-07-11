import { CalendarClock, Droplet, HeartHandshake, MapPin, Search, ShieldCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BLOOD_GROUPS, DONATION_INTERVAL_DAYS, SITE } from "@/lib/config";

const steps = [
  {
    icon: UserPlus,
    title: "Register as a donor",
    body: "Create your profile with your blood group, district and upazila in under a minute.",
  },
  {
    icon: Search,
    title: "Search when in need",
    body: "Filter donors by blood group and location to find a match close to the patient.",
  },
  {
    icon: HeartHandshake,
    title: "Connect and donate",
    body: "Reach out directly, donate safely, and track your donation history on your dashboard.",
  },
];

const assurances = [
  {
    icon: ShieldCheck,
    title: "Privacy first",
    body: "Donor contact details are visible only to signed-in members — never to anonymous visitors.",
  },
  {
    icon: CalendarClock,
    title: "Safe donation intervals",
    body: `The platform enforces a ${DONATION_INTERVAL_DAYS}-day gap between donations, so donors are always asked at the right time.`,
  },
  {
    icon: MapPin,
    title: "All 64 districts",
    body: "Location data covers every district and upazila in Bangladesh for precise matching.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-brand-100/60 blur-3xl"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
              <Droplet className="size-3.5 fill-current" aria-hidden />
              Community blood donation network
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              {SITE.tagline.split(",")[0]},
              <span className="text-brand-600"> when every minute counts.</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-slate-600">
              {SITE.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/donors">
                <Button size="lg">
                  <Search className="size-5" aria-hidden />
                  Find a donor
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline">
                  Become a donor
                </Button>
              </Link>
            </div>
          </div>

          {/* Blood group quick search */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
            <h2 className="mb-1 text-lg font-bold text-slate-900">Search by blood group</h2>
            <p className="mb-6 text-sm text-slate-500">
              Jump straight to donors with the group you need.
            </p>
            <div className="grid grid-cols-4 gap-3">
              {BLOOD_GROUPS.map((group) => (
                <Link
                  key={group}
                  href={`/donors?blood_group=${encodeURIComponent(group)}`}
                  className="focus-ring group flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:shadow-card-hover"
                >
                  <span className="text-xl font-extrabold text-brand-700 sm:text-2xl">{group}</span>
                  <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400 group-hover:text-brand-500">
                    donors
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">How it works</h2>
          <p className="mt-2 text-slate-500">Three steps between a request and a life saved.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card"
            >
              <span className="absolute right-5 top-4 text-5xl font-extrabold text-slate-100">
                {index + 1}
              </span>
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <step.icon className="size-5" aria-hidden />
              </div>
              <h3 className="mb-1.5 font-bold text-slate-900">{step.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Assurances */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-3">
          {assurances.map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
                <item.icon className="size-5" aria-hidden />
              </div>
              <div>
                <h3 className="mb-1 font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-brand-700 px-6 py-14 text-center sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 -top-16 size-64 rounded-full bg-brand-600/60 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -right-10 size-72 rounded-full bg-brand-800/70 blur-2xl"
          />
          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              One donation can save up to three lives.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-brand-100">
              Join the donor community today — your blood group might be exactly what someone
              nearby is searching for right now.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="bg-white text-brand-700 hover:bg-brand-50 active:bg-brand-100">
                  Register now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
