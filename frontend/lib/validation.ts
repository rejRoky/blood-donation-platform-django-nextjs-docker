import { z } from "zod";
import { BLOOD_GROUPS } from "@/lib/config";

/** Bangladesh mobile: 11 digits starting with 01 — mirrors the backend rule. */
export const mobileSchema = z
  .string()
  .trim()
  .regex(/^01\d{9}$/, "Enter a valid 11-digit mobile number starting with 01");

/** Password rules mirror the backend PasswordStrengthValidator. */
export const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/\d/, "Must contain a digit")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[@#$%^&*()\-+=]/, "Must contain a special character (@#$%^&*()-+=)");

export const loginSchema = z.object({
  mobile_number: mobileSchema,
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    first_name: z.string().trim().min(1, "First name is required").max(50),
    last_name: z.string().trim().min(1, "Last name is required").max(50),
    mobile_number: mobileSchema,
    email: z.union([z.literal(""), z.string().email("Enter a valid email")]).optional(),
    blood_group: z.enum(BLOOD_GROUPS, { message: "Select your blood group" }),
    district: z.coerce.number({ message: "Select your district" }).int().positive("Select your district"),
    upazila: z.coerce.number({ message: "Select your upazila" }).int().positive("Select your upazila"),
    password: passwordSchema,
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const profileSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(50),
  last_name: z.string().trim().min(1, "Last name is required").max(50),
  email: z.union([z.literal(""), z.string().email("Enter a valid email")]).optional(),
  blood_group: z.enum(BLOOD_GROUPS, { message: "Select your blood group" }),
  district_id: z.coerce.number({ message: "Select your district" }).int().positive("Select your district"),
  upazila_id: z.coerce.number({ message: "Select your upazila" }).int().positive("Select your upazila"),
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const donationSchema = z.object({
  date: z.string().min(1, "Donation date is required"),
  amount: z.coerce
    .number({ message: "Enter the amount in ml" })
    .int()
    .min(100, "Minimum 100 ml")
    .max(1000, "Maximum 1000 ml"),
  note: z.string().trim().max(255, "Keep the note short").optional(),
});
export type DonationInput = z.infer<typeof donationSchema>;

export const resetRequestSchema = z.object({
  mobile_number: mobileSchema,
});
export type ResetRequestInput = z.infer<typeof resetRequestSchema>;

export const resetPasswordSchema = z
  .object({
    new_password: passwordSchema,
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
