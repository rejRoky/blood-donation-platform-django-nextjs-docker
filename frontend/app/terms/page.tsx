import type { Metadata } from "next";
import { SITE } from "@/lib/config";

export const metadata: Metadata = { title: "Terms of use" };

const sections = [
  {
    title: "1. Purpose of the platform",
    body: `${SITE.name} exists solely to connect voluntary blood donors with people who need blood. It is not a blood bank, a medical service, or an emergency service. Always follow the advice of qualified medical professionals.`,
  },
  {
    title: "2. Donor information",
    body: "Donors share their name, blood group, location and mobile number voluntarily so that people in need can contact them. Contact details are visible only to signed-in members. Use of this information for anything other than requesting blood donation — including marketing, harassment, or scraping — is strictly prohibited.",
  },
  {
    title: "3. Respectful contact",
    body: "Contact donors only about genuine blood requests, at reasonable hours, and respect their availability status. A donor may decline any request for any reason. Abusive or fraudulent behaviour leads to account removal.",
  },
  {
    title: "4. Health and eligibility",
    body: "Donors are responsible for confirming their own eligibility to donate (age, weight, health conditions and donation interval) with the collecting facility. The platform's donation-interval tracking is an aid, not medical advice.",
  },
  {
    title: "5. No fees, no guarantees",
    body: "The platform is free to use. Blood must never be bought or sold through this service. We cannot guarantee donor availability or response times.",
  },
  {
    title: "6. Account responsibility",
    body: "Keep your credentials private and your profile accurate. You may delete your donation records or stop appearing in search results by marking yourself unavailable at any time.",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Terms of use</h1>
      <p className="mt-2 text-sm text-slate-500">
        By using {SITE.name} you agree to the following terms.
      </p>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-bold text-slate-900">{section.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
