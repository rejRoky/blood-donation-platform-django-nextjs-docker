"use client";

import { useResetPasswordMutation } from "@/redux/features/user/userApi";
import { Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ResetPassForm = ({ phoneNumber, resetToken }) => {
  const router = useRouter();
  const [resetpassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    try {
      const res = await resetpassword({
        mobile_number: phoneNumber,
        reset_token: resetToken,
        new_password: data.password,
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Password reset successful.");
        router.push("/login");
      } else {
        toast.error(res.message || "Failed to reset password.");
      }
    } catch (err) {
      if (err?.data?.errors) {
        Object.entries(err.data.errors).forEach(([field, messages]) => {
          setError(field === "new_password" ? "password" : field, {
            type: "server",
            message: messages[0],
          });
        });
      } else {
        toast.error(err?.data?.message || "An error occurred.");
      }
    }
  };

  return (
    <div className="max-w-lg w-full bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-xl p-6 sm:p-12 border border-red-100 relative overflow-hidden secondary-card">
      {/* Decorative accent circle */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-100 rounded-full opacity-30" />

      <div className="relative z-10">
        {/* Title */}
        <p className="font-bold text-red-600 mb-2 text-2xl sm:text-3xl text-center">
          Reset Your Password
        </p>
        <p className="text-gray-500 text-center mb-8">
          Please enter your new password below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* New Password */}
          <TextField
            label={
              <>
                New Password <span className="text-red-500">*</span>
              </>
            }
            variant="outlined"
            size="small"
            fullWidth
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{
              "& .MuiInputLabel-root": { color: "#6B7280" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#dc2626" },
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "#dc2626" },
                "&.Mui-focused fieldset": { borderColor: "#dc2626" },
              },
            }}
          />

          {/* Confirm Password */}
          <div className="mt-5">
            <TextField
              label={
                <>
                  Confirm Password <span className="text-red-500">*</span>
                </>
              }
              variant="outlined"
              size="small"
              fullWidth
              type="password"
              {...register("confirm_password", {
                required: "Confirm password is required",
                validate: (value) =>
                  value == password || "Passwords do not match",
              })}
              error={!!errors.confirm_password}
              helperText={errors.confirm_password?.message}
              sx={{
                "& .MuiInputLabel-root": { color: "#6B7280" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#dc2626" },
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#dc2626" },
                  "&.Mui-focused fieldset": { borderColor: "#dc2626" },
                },
              }}
            />
          </div>

          {/* Reset Button */}
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
              {isLoading ? "Resetting..." : "Reset Password"}
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

export default ResetPassForm;
