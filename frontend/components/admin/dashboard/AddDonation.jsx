import { Button, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

const AddDonation = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            donationDate: '',
            bloodAmount: ''
        }
    });

    const onSubmit = (data) => console.log(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
            <div className="grid grid-cols-2 gap-5">
                <Controller
                    control={control}
                    name="donationDate"
                    rules={{ required: 'Donation date is required' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="date"
                            label={<>Donation Date <span className="text-red-500">*</span></>}
                            size="small"
                            error={!!errors.donationDate}
                            helperText={errors.donationDate ? errors.donationDate.message : ''}
                            fullWidth
                            margin="normal"
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                            sx={{
                                '& .MuiInputLabel-root': {
                                    color: '#6B7280',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#dc2626',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#AC0102',
                                    },
                                },
                            }}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="bloodAmount"
                    rules={{ required: 'Blood amount is required' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="number"
                            label={<>Blood Amount (ml) <span className="text-red-500">*</span></>}
                            size="small"
                            error={!!errors.bloodAmount}
                            helperText={errors.bloodAmount ? errors.bloodAmount.message : ''}
                            fullWidth
                            margin="normal"
                            sx={{
                                '& .MuiInputLabel-root': {
                                    color: '#6B7280',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#dc2626',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#AC0102',
                                    },
                                },
                            }}
                        />
                    )}
                />
            </div>

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
    )
}

export default AddDonation;