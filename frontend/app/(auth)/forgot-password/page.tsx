import type { Metadata } from "next";
import { ForgotPasswordWizard } from "@/components/auth/forgot-password-wizard";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return <ForgotPasswordWizard />;
}
