import { useAddDonationHistoryMutation } from "@/redux/features/donationHistory/donationHistoryApi";
import { Button, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const AddNewDonation = ({ userId, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const [addDonationHistory] = useAddDonationHistoryMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      user_id: userId,
      last_donation_date: "",
      blood_amount: "",
      note: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      await addDonationHistory({
        date: formData.last_donation_date,
        amount: Number(formData.blood_amount),
        note: formData.note,
      }).unwrap();
      toast.success("Donation saved successfully!");
      reset();
      handleClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save donation");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
      <div className="grid grid-cols-2 gap-5">
        {/* Date Field */}
        <Controller
          control={control}
          name="last_donation_date"
          rules={{ required: "Donation date is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              label={
                <>
                  Donation Date <span className="text-red-500">*</span>
                </>
              }
              size="small"
              error={!!errors.last_donation_date}
              helperText={errors.last_donation_date?.message || ""}
              fullWidth
              margin="normal"
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: {
                  max: new Date().toISOString().split("T")[0],
                },
              }}
              sx={{
                "& .MuiInputLabel-root": { color: "#6B7280" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#dc2626" },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                  borderColor: "#AC0102",
                },
              }}
            />
          )}
        />

        {/* Blood Amount */}
        <Controller
          control={control}
          name="blood_amount"
          rules={{ required: "Blood amount is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label={
                <>
                  Blood Amount (ml) <span className="text-red-500">*</span>
                </>
              }
              size="small"
              error={!!errors.blood_amount}
              helperText={errors.blood_amount?.message || ""}
              fullWidth
              margin="normal"
              sx={{
                "& .MuiInputLabel-root": { color: "#6B7280" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#dc2626" },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                  borderColor: "#AC0102",
                },
              }}
            />
          )}
        />
      </div>

      {/* Note Field */}
      <Controller
        control={control}
        name="note"
        render={({ field }) => (
          <TextField
            {...field}
            label="Note"
            multiline
            fullWidth
            margin="normal"
          />
        )}
      />

      {/* Submit */}
      <div className="flex w-full justify-end">
        <Button
          type="submit"
          variant="contained"
          color="error"
          sx={{ mt: 2, mb: 3 }}
        >
          Save New Donation
        </Button>
      </div>
    </form>
  );
};

export default AddNewDonation;
