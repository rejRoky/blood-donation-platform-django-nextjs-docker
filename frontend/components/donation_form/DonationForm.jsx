"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useDonationPaymentMutation } from "@/redux/features/donationPayment/donationPaymentApi";
import { Button, Divider, TextField } from "@mui/material";

const DonationForm = () => {
  const [donationPayment] = useDonationPaymentMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      amount: "",
      name: "",
      phone: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await donationPayment(data).unwrap();
      const gatewayUrl = res?.GatewayPageURL;

      if (gatewayUrl) {
        window.location.href = gatewayUrl;
      } else {
        alert("Payment initiation failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while initiating payment. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="secondary-card">
      <p className="font-semibold text-red-500 mb-5 text-xl sm:text-3xl">
        Fund Donation Form
      </p>

      <Controller
        name="amount"
        control={control}
        rules={{
          required: "Donation amount is required",
          min: { value: 1, message: "Amount must be at least 1" },
          pattern: {
            value: /^\d+(\.\d{1,2})?$/,
            message: "Enter a valid amount",
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            id="amount"
            type="number"
            label={
              <>
                Donation Amount (BDT) <span className="text-red-500">*</span>
              </>
            }
            variant="outlined"
            fullWidth
            error={!!errors.amount}
            helperText={errors.amount ? errors.amount.message : ""}
            sx={{
              "& .MuiInputLabel-root": { color: "#6B7280" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#dc2626" },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": { borderColor: "#AC0102" },
              },
            }}
          />
        )}
      />

      <Controller
        name="phone"
        control={control}
        rules={{
          pattern: {
            value: /^(\+?88)?01[3-9]\d{8}$/,
            message: "Enter a valid Bangladeshi phone number",
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            required
            id="phone"
            label="Phone Number"
            variant="outlined"
            size="small"
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone ? errors.phone.message : ""}
            sx={{
              mt: 2,
              "& .MuiInputLabel-root": { color: "#6B7280" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#dc2626" },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": { borderColor: "#AC0102" },
              },
            }}
          />
        )}
      />

      <div className="text-slate-700 mt-4">
        <Divider textAlign="left">Optional Info</Divider>
      </div>

      <Controller
        name="name"
        control={control}
        rules={{
          maxLength: { value: 50, message: "Name too long" },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            id="name"
            label="Name"
            variant="outlined"
            size="small"
            fullWidth
            error={!!errors.name}
            helperText={errors.name ? errors.name.message : ""}
            sx={{
              mt: 2,
              "& .MuiInputLabel-root": { color: "#6B7280" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#dc2626" },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": { borderColor: "#AC0102" },
              },
            }}
          />
        )}
      />

      <div className="mt-4 text-end">
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Donate Now"}
        </Button>
      </div>
    </form>
  );
};

export default DonationForm;
