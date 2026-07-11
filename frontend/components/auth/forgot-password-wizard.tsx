"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, KeyRound, MessageSquareText, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/field";
import { Card } from "@/components/ui/misc";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  resetPasswordSchema,
  resetRequestSchema,
  type ResetPasswordInput,
  type ResetRequestInput,
} from "@/lib/validation";

type Step = "request" | "verify" | "reset";

const steps: Array<{ key: Step; label: string; icon: typeof Smartphone }> = [
  { key: "request", label: "Mobile", icon: Smartphone },
  { key: "verify", label: "OTP", icon: MessageSquareText },
  { key: "reset", label: "New password", icon: KeyRound },
];

const OTP_LENGTH = 6;

export function ForgotPasswordWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [mobileNumber, setMobileNumber] = useState("");
  const [resetToken, setResetToken] = useState("");

  const stepIndex = steps.findIndex((item) => item.key === step);

  return (
    <Card className="p-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Reset your password</h1>

      {/* Step indicator */}
      <ol className="mb-8 mt-5 flex items-center gap-2" aria-label="Progress">
        {steps.map((item, index) => (
          <li key={item.key} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                index < stepIndex && "border-brand-600 bg-brand-600 text-white",
                index === stepIndex && "border-brand-600 bg-brand-50 text-brand-700",
                index > stepIndex && "border-slate-200 bg-white text-slate-400",
              )}
              aria-current={index === stepIndex ? "step" : undefined}
            >
              {index < stepIndex ? <CheckCircle2 className="size-4" /> : <item.icon className="size-4" />}
            </span>
            <span
              className={cn(
                "hidden text-xs font-semibold sm:block",
                index <= stepIndex ? "text-slate-800" : "text-slate-400",
              )}
            >
              {item.label}
            </span>
            {index < steps.length - 1 && <span className="h-px flex-1 bg-slate-200" aria-hidden />}
          </li>
        ))}
      </ol>

      {step === "request" && (
        <RequestStep
          onSent={(mobile) => {
            setMobileNumber(mobile);
            setStep("verify");
          }}
        />
      )}
      {step === "verify" && (
        <VerifyStep
          mobileNumber={mobileNumber}
          onVerified={(token) => {
            setResetToken(token);
            setStep("reset");
          }}
        />
      )}
      {step === "reset" && (
        <ResetStep
          mobileNumber={mobileNumber}
          resetToken={resetToken}
          onDone={() => router.push("/login")}
        />
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-brand-700 hover:underline">
          Back to sign in
        </Link>
      </p>
    </Card>
  );
}

function RequestStep({ onSent }: { onSent: (mobile: string) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetRequestInput>({ resolver: zodResolver(resetRequestSchema) });

  const onSubmit = async (values: ResetRequestInput) => {
    try {
      const response = await api<{ message: string }>("/users/send-reset-password-otp/", {
        method: "POST",
        body: { mobile_number: values.mobile_number },
      });
      toast.success(response.message);
      onSent(values.mobile_number);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not send the OTP. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <p className="text-sm text-slate-500">
        Enter the mobile number you registered with. If an account exists, we&apos;ll send it a
        one-time code.
      </p>
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
      <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
        Send code
      </Button>
    </form>
  );
}

function VerifyStep({
  mobileNumber,
  onVerified,
}: {
  mobileNumber: string;
  onVerified: (resetToken: string) => void;
}) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const setDigit = (index: number, value: string) => {
    const next = [...digits];
    next[index] = value;
    setDigits(next);
  };

  const handleChange = (index: number, raw: string) => {
    const value = raw.replace(/\D/g, "");
    if (!value) {
      setDigit(index, "");
      return;
    }
    // Support pasting the whole code into any box
    if (value.length > 1) {
      const next = Array(OTP_LENGTH).fill("");
      value
        .slice(0, OTP_LENGTH)
        .split("")
        .forEach((char, i) => (next[i] = char));
      setDigits(next);
      inputs.current[Math.min(value.length, OTP_LENGTH) - 1]?.focus();
      return;
    }
    setDigit(index, value);
    if (index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const submit = async () => {
    const otp = digits.join("");
    if (otp.length !== OTP_LENGTH) {
      toast.error(`Enter the ${OTP_LENGTH}-digit code.`);
      return;
    }
    setSubmitting(true);
    try {
      const response = await api<{ reset_token: string; message: string }>(
        "/users/verify-reset-password-otp/",
        { method: "POST", body: { mobile_number: mobileNumber, otp } },
      );
      toast.success(response.message);
      onVerified(response.reset_token);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Verification failed. Try again.");
      setDigits(Array(OTP_LENGTH).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    setResending(true);
    try {
      const response = await api<{ message: string }>("/users/send-reset-password-otp/", {
        method: "POST",
        body: { mobile_number: mobileNumber },
      });
      toast.success(response.message);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not resend the code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">
        We sent a {OTP_LENGTH}-digit code to <span className="font-semibold text-slate-800">{mobileNumber}</span>.
        It expires in 5 minutes.
      </p>
      <div className="flex justify-between gap-2" role="group" aria-label="One-time code">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputs.current[index] = element;
            }}
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            inputMode="numeric"
            maxLength={OTP_LENGTH}
            aria-label={`Digit ${index + 1}`}
            className="focus-ring size-12 rounded-xl border border-slate-300 bg-white text-center text-xl font-bold text-slate-900"
          />
        ))}
      </div>
      <Button className="w-full" size="lg" loading={submitting} onClick={submit}>
        Verify code
      </Button>
      <p className="text-center text-sm text-slate-500">
        Didn&apos;t get it?{" "}
        <button
          type="button"
          onClick={resend}
          disabled={resending}
          className="font-semibold text-brand-700 hover:underline disabled:opacity-50"
        >
          {resending ? "Resending…" : "Resend code"}
        </button>
      </p>
    </div>
  );
}

function ResetStep({
  mobileNumber,
  resetToken,
  onDone,
}: {
  mobileNumber: string;
  resetToken: string;
  onDone: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (values: ResetPasswordInput) => {
    try {
      const response = await api<{ message: string }>("/users/reset-password/", {
        method: "POST",
        body: {
          mobile_number: mobileNumber,
          reset_token: resetToken,
          new_password: values.new_password,
        },
      });
      toast.success(response.message);
      onDone();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not reset the password.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <InputField
        label="New password"
        required
        type="password"
        autoComplete="new-password"
        hint="Min 8 characters with an uppercase, lowercase, digit and special character."
        error={errors.new_password?.message}
        {...register("new_password")}
      />
      <InputField
        label="Confirm new password"
        required
        type="password"
        autoComplete="new-password"
        error={errors.confirm_password?.message}
        {...register("confirm_password")}
      />
      <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
        Set new password
      </Button>
    </form>
  );
}
