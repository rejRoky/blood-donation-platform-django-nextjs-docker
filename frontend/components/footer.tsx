import { Droplet, Facebook, Linkedin, Mail, Phone, Youtube } from "lucide-react";
import Link from "next/link";
import { serverApi } from "@/lib/api";
import { SITE } from "@/lib/config";
import type { Paginated, SiteSetting } from "@/lib/types";

async function getSiteSettings(): Promise<SiteSetting | null> {
  try {
    const data = await serverApi<SiteSetting[] | Paginated<SiteSetting>>("/site-settings/", {
      next: { revalidate: 300 },
    });
    return (Array.isArray(data) ? data[0] : data.results?.[0]) ?? null;
  } catch {
    return null; // footer must render even if the API is briefly down
  }
}

export async function Footer() {
  const settings = await getSiteSettings();
  const name = settings?.site_name || SITE.name;

  const socials = [
    { href: settings?.site_facebook, icon: Facebook, label: "Facebook" },
    { href: settings?.site_linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: settings?.site_youtube, icon: Youtube, label: "YouTube" },
  ].filter((social) => Boolean(social.href));

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Droplet className="size-4 fill-current" aria-hidden />
            </span>
            <span className="font-extrabold text-slate-900">{name}</span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-slate-500">{SITE.description}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Platform
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link className="text-slate-600 hover:text-brand-700" href="/donors">Find donors</Link></li>
            <li><Link className="text-slate-600 hover:text-brand-700" href="/register">Become a donor</Link></li>
            <li><Link className="text-slate-600 hover:text-brand-700" href="/about">About</Link></li>
            <li><Link className="text-slate-600 hover:text-brand-700" href="/terms">Terms of use</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Contact
          </h3>
          <ul className="space-y-2 text-sm text-slate-600">
            {settings?.site_phone && (
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-brand-600" aria-hidden />
                <a className="hover:text-brand-700" href={`tel:${settings.site_phone}`}>{settings.site_phone}</a>
              </li>
            )}
            {settings?.site_email && (
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-brand-600" aria-hidden />
                <a className="hover:text-brand-700" href={`mailto:${settings.site_email}`}>{settings.site_email}</a>
              </li>
            )}
            {settings?.site_address && <li>{settings.site_address}</li>}
            {socials.length > 0 && (
              <li className="flex gap-3 pt-1">
                {socials.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="focus-ring rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-brand-50 hover:text-brand-700"
                  >
                    <Icon className="size-4" aria-hidden />
                  </a>
                ))}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {name}. Every drop counts.
      </div>
    </footer>
  );
}
