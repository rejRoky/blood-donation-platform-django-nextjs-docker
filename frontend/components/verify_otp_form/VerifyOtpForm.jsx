"use client";

import {
  useSendResetOtpMutation,
  useVerifyResetOtpMutation,
} from "@/redux/features/user/userApi";
import { Button } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const VerifyOtpForm = ({ phoneNumber }) => {
  const [verifyResetOtp, { isLoading }] = useVerifyResetOtpMutation();
  const [sendResetOtp, { isLoading: sendOtpIsLoading }] =
    useSendResetOtpMutation();
  const [otp, setOtp] = useState("");
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const router = useRouter();

  const handleChange = (newValue) => {
    setOtp(newValue);
    setServerError("");
    setServerSuccess("");
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setServerError("Please enter a valid 6-digit OTP.");
      return;
    }
    setServerError("");
    setServerSuccess("");
    try {
      const res = await verifyResetOtp({
        mobile_number: phoneNumber,
        otp: otp,
      }).unwrap();

      if (res.success && res.reset_token) {
        toast.success(res.message || "OTP verified successfully.");
        router.push(
          `/reset-password?num=${phoneNumber}&token=${encodeURIComponent(
            res.reset_token
          )}`
        );
      } else {
        setServerError(res.message || "OTP verification failed.");
      }
    } catch (err) {
      setServerError(err?.data?.message || "An error occurred.");
    }
  };

  const handleResendOtp = async () => {
    setServerError("");
    setServerSuccess("");
    try {
      const res = await sendResetOtp({ mobile_number: phoneNumber }).unwrap();
      if (res.success) {
        setServerSuccess(res.message || "OTP sent to your mobile");
      }
      setOtp("");
    } catch (err) {
      setServerError(
        err?.data?.message || "Failed to resend OTP. Please try again."
      );
    }
  };

  return (
    <div className="max-w-lg w-full bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-xl p-6 sm:p-12 border border-red-100 relative overflow-hidden secondary-card">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-100 rounded-full opacity-30 " />

      <div className="relative z-10">
        <p className="font-bold text-red-600 mb-6 text-2xl sm:text-3xl text-center">
          Verify OTP
        </p>
        <p className="text-gray-500 text-center mb-8">
          Please enter the 6-digit code sent to your phone
        </p>

        <MuiOtpInput
          value={otp}
          onChange={handleChange}
          length={6}
          sx={{
            gap: "0.4rem",
            "& input": {
              fontSize: "1.25rem",
              padding: "0.75rem 0",
              color: "#dc2626",
              fontWeight: 500,
            },
          }}
        />

        {/* Server error */}
        {serverError && (
          <p className="text-red-500 text-sm mt-2 text-center">{serverError}</p>
        )}

        {/* Submit Button */}
        <div className="mt-8">
          <Button
            variant="contained"
            fullWidth
            disabled={isLoading}
            onClick={handleVerify}
            sx={{
              backgroundColor: "#dc2626",
              fontSize: "1rem",
              paddingY: "0.75rem",
              borderRadius: "0.75rem",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#b91c1c",
              },
            }}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>

        {/* Resend link */}
        <p className="text-center mt-5 text-sm text-gray-500">
          Didn't receive the code?{" "}
          <span
            className={`text-red-500 font-medium hover:underline cursor-pointer ${
              sendOtpIsLoading ? "opacity-50 pointer-events-none" : ""
            }`}
            onClick={sendOtpIsLoading ? null : handleResendOtp}
          >
            {sendOtpIsLoading ? "Resending..." : "Resend OTP"}
          </span>
        </p>

        {!serverSuccess && (
          <p className="text-red-500 text-sm mt-2 text-center">
            {serverSuccess}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyOtpForm;
