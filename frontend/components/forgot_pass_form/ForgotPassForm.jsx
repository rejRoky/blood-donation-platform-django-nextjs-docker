"use client";

import { useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useSendResetOtpMutation } from "@/redux/features/user/userApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ForgotPassForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const [sendResetOtp, { isLoading }] = useSendResetOtpMutation();
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await sendResetOtp(data).unwrap();
      toast.success(res.message);
      router.push(`/verify-otp?num=${data.phone_number}`);
    } catch (err) {
      if (err?.data?.errors) {
        Object.keys(err.data.errors).forEach((field) => {
          setError(field, {
            type: "server",
            message: err.data.errors[field][0],
          });
        });
      } else if (err?.data?.message) {
        setServerError(err.data.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-lg w-full bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-xl p-6 sm:p-12 border border-red-100 relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-100 rounded-full opacity-30" />

      <div className="relative z-10">
        {/* Heading */}
        <p className="font-bold text-red-600 mb-2 text-2xl sm:text-3xl text-center">
          Forgot Password
        </p>
        <p className="text-gray-500 text-center mb-8">
          Enter your phone number and we'll send you an OTP to reset your
          password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Phone Number Input */}
          <TextField
            label={
              <>
                Phone Number <span className="text-red-500">*</span>
              </>
            }
            variant="outlined"
            size="small"
            fullWidth
            placeholder="e.g. 017XXXXXXXX"
            {...register("phone_number", {
              required: "Phone number is required",
            })}
            error={!!errors.phone_number}
            helperText={errors.phone_number?.message}
            sx={{
              "& .MuiInputLabel-root": { color: "#6B7280" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#dc2626" },
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "#dc2626" },
                "&.Mui-focused fieldset": { borderColor: "#dc2626" },
              },
            }}
          />

          {/* Server error */}
          {serverError && (
            <p className="text-red-500 text-sm mt-2">{serverError}</p>
          )}

          {/* Submit Button */}
          <div className="mt-8">
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                backgroundColor: "#dc2626",
                fontSize: "1rem",
                paddingY: "0.75rem",
                borderRadius: "0.75rem",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#b91c1c" },
              }}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          </div>
        </form>

        {/* Back to login link */}
        <p className="text-center mt-5 text-sm text-gray-500">
          Remembered your password?{" "}
          <Link href="/login">
            <span className="text-red-500 font-medium hover:underline cursor-pointer">
              Back to Login
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassForm;
