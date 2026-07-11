"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AreaSelect } from "@/components/area-select";
import { Button } from "@/components/ui/button";
import { InputField, SelectField } from "@/components/ui/field";
import { Card, Skeleton } from "@/components/ui/misc";
import { BLOOD_GROUPS, type BloodGroup } from "@/lib/config";
import { applyApiErrors } from "@/lib/form-errors";
import { useProfile, useUpdateProfile } from "@/lib/hooks";
import { profileSchema, type ProfileInput } from "@/lib/validation";

const FIELDS = ["first_name", "last_name", "email", "blood_group", "district_id", "upazila_id"] as const;

export function ProfileForm() {
  const router = useRouter();
  const profile = useProfile();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<ProfileInput>({ resolver: zodResolver(profileSchema) });

  // Populate the form once the profile arrives
  useEffect(() => {
    if (profile.data) {
      reset({
        first_name: profile.data.first_name ?? "",
        last_name: profile.data.last_name ?? "",
        email: profile.data.email ?? "",
        blood_group: (profile.data.blood_group as BloodGroup) ?? undefined,
        district_id: profile.data.district_id ?? undefined,
        upazila_id: profile.data.upazila_id ?? undefined,
      });
    }
  }, [profile.data, reset]);

  const districtValue = watch("district_id");

  if (profile.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  const onSubmit = async (values: ProfileInput) => {
    try {
      await updateProfile.mutateAsync({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email || null,
        blood_group: values.blood_group,
        district_id: values.district_id,
        upazila_id: values.upazila_id,
      });
      toast.success("Profile updated.");
      router.push("/dashboard");
    } catch (error) {
      applyApiErrors(error, setError, FIELDS);
    }
  };

  return (
    <>
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-700"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to dashboard
      </Link>

      <Card className="p-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Edit profile</h1>
        <p className="mb-6 mt-1 text-sm text-slate-500">
          Keep your details current so seekers can reach the right donor.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="First name"
              required
              error={errors.first_name?.message}
              {...register("first_name")}
            />
            <InputField
              label="Last name"
              required
              error={errors.last_name?.message}
              {...register("last_name")}
            />
          </div>

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
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <AreaSelect
            required
            districtValue={districtValue}
            districtProps={register("district_id")}
            upazilaProps={register("upazila_id")}
            districtError={errors.district_id?.message}
            upazilaError={errors.upazila_id?.message}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Link href="/dashboard">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
            <Button type="submit" loading={updateProfile.isPending} disabled={!isDirty}>
              Save changes
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
