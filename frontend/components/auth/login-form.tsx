"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/field";
import { Card } from "@/components/ui/misc";
import { loginSchema, type LoginInput } from "@/lib/validation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const sessionExpired = searchParams.get("expired") === "1";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginInput) => {
    const result = await signIn("credentials", {
      mobile_number: values.mobile_number,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      const message =
        result.error === "CredentialsSignin"
          ? "Invalid mobile number or password."
          : result.error;
      setError("password", { type: "server", message });
      toast.error(message);
      return;
    }

    toast.success("Welcome back!");
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <Card className="p-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Sign in</h1>
      <p className="mb-6 mt-1 text-sm text-slate-500">
        {sessionExpired ? "Your session expired — please sign in again." : "Good to see you again."}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <InputField
          label="Mobile number"
          required
          type="tel"
          inputMode="numeric"
          placeholder="01XXXXXXXXX"
          autoComplete="username"
          error={errors.mobile_number?.message}
          {...register("mobile_number")}
        />
        <InputField
          label="Password"
          required
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="text-right">
          <Link href="/forgot-password" className="text-sm font-medium text-brand-700 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{" "}
        <Link href="/register" className="font-semibold text-brand-700 hover:underline">
          Register as a donor
        </Link>
      </p>
    </Card>
  );
}
