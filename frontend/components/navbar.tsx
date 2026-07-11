"use client";

import { Droplet, LayoutDashboard, LogOut, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/config";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/donors", label: "Find donors" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const { status } = useSession();
  const [open, setOpen] = useState(false);

  const authed = status === "authenticated";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="focus-ring flex items-center gap-2 rounded-lg" onClick={() => setOpen(false)}>
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Droplet className="size-5 fill-current" aria-hidden />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">{SITE.name}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "focus-ring rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {authed ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <LayoutDashboard className="size-4" aria-hidden />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="size-4" aria-hidden />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Become a donor</Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="focus-ring rounded-lg p-2 text-slate-600 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "focus-ring rounded-lg px-3 py-2.5 text-sm font-medium",
                  pathname === link.href ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-100",
                )}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-slate-200" />
            {authed ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="focus-ring flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <LayoutDashboard className="size-4" aria-hidden /> Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="focus-ring flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <LogOut className="size-4" aria-hidden /> Sign out
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-1 pt-1">
                <Link href="/login" onClick={() => setOpen(false)} className="flex-1">
                  <Button variant="outline" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)} className="flex-1">
                  <Button className="w-full">
                    <Search className="size-4" aria-hidden />
                    Become a donor
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
