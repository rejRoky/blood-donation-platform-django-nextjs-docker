"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AreaSelect } from "@/components/area-select";
import { Button } from "@/components/ui/button";
import { InputField, SelectField } from "@/components/ui/field";
import { Card } from "@/components/ui/misc";
import { api } from "@/lib/api";
import { BLOOD_GROUPS } from "@/lib/config";
import { applyApiErrors } from "@/lib/form-errors";
import { registerSchema, type RegisterInput } from "@/lib/validation";

const FIELDS = [
  "first_name",
  "last_name",
  "mobile_number",
  "email",
  "blood_group",
  "district",
  "upazila",
  "password",
] as const;

export function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const districtValue = watch("district");

  const onSubmit = async (values: RegisterInput) => {
    try {
      await api("/users/register/", {
        method: "POST",
        body: {
          mobile_number: values.mobile_number,
          password: values.password,
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email || undefined,
          blood_group: values.blood_group,
          district: values.district,
          upazila: values.upazila,
        },
      });

      toast.success("Welcome aboard! Signing you in…");
      const result = await signIn("credentials", {
        mobile_number: values.mobile_number,
        password: values.password,
        redirect: false,
      });
      router.push(result?.error ? "/login" : "/dashboard");
      router.refresh();
    } catch (error) {
      applyApiErrors(error, setError, FIELDS);
    }
  };

  return (
    <Card className="p-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Become a donor</h1>
      <p className="mb-6 mt-1 text-sm text-slate-500">
        Join the community — takes less than a minute.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="First name"
            required
            placeholder="Rahim"
            autoComplete="given-name"
            error={errors.first_name?.message}
            {...register("first_name")}
          />
          <InputField
            label="Last name"
            required
            placeholder="Uddin"
            autoComplete="family-name"
            error={errors.last_name?.message}
            {...register("last_name")}
          />
        </div>

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

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Blood group"
            required
            placeholder="Select group"
            error={errors.blood_group?.message}
            options={BLOOD_GROUPS.map((group) => ({ value: group, label: group }))}
            {...register("blood_group")}
          />
          <InputField
            label="Email (optional)"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <AreaSelect
          required
          districtValue={districtValue}
          districtProps={register("district", {
            // District changed — the previously selected upazila no longer applies
            onChange: () => resetField("upazila"),
          })}
          upazilaProps={register("upazila")}
          districtError={errors.district?.message}
          upazilaError={errors.upazila?.message}
        />

        <InputField
          label="Password"
          required
          type="password"
          autoComplete="new-password"
          hint="Min 8 characters with an uppercase, lowercase, digit and special character."
          error={errors.password?.message}
          {...register("password")}
        />
        <InputField
          label="Confirm password"
          required
          type="password"
          autoComplete="new-password"
          error={errors.confirm_password?.message}
          {...register("confirm_password")}
        />

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          Create my donor profile
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-brand-700 hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
