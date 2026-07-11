import type { Metadata } from "next";
import { ProfileForm } from "@/components/dashboard/profile-form";

export const metadata: Metadata = { title: "Edit profile" };

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <ProfileForm />
    </div>
  );
}
