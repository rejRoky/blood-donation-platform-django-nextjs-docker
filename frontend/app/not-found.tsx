import { Droplet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Droplet className="size-7" aria-hidden />
      </span>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Page not found</h1>
      <p className="max-w-sm text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/">
        <Button variant="outline">Back to home</Button>
      </Link>
    </div>
  );
}
