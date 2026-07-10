"use client";

import { TextField, Button, Divider, Autocomplete } from "@mui/material";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";


const activeStatus = [
    { label: "Active", id: 1 },
    { label: "Inactive", id: 2 },
]

const donateFirst = [
    { label: 'Yes', id: 1 },
    { label: 'No', id: 2 },
]

const bloodGroup = [
    { label: 'A+ (Ve)', id: 1 },
    { label: 'A- (Ve)', id: 2 },
    { label: 'B+ (Ve)', id: 3 },
    { label: 'B- (Ve)', id: 4 },
    { label: 'AB+ (Ve)', id: 5 },
    { label: 'AB- (Ve)', id: 6 },
    { label: 'O+ (Ve)', id: 7 },
    { label: 'O- (Ve)', id: 8 },
];

const zilla = [
    { label: 'Dhaka', id: 1, upozilla: [{ label: 'dhaka', id: 1 }] },
    { label: 'Chittagong', id: 2, upozilla: [{ label: 'chit', id: 1 }] },
    { label: 'Rajshahi', id: 3, upozilla: [{ label: 'paba', id: 1 }, { label: 'boalia', id: 2 }] },
    { label: 'Mymensingh', id: 4, upozilla: [{ label: 'mye', id: 1 }] },
];

const defaultValues = {
    firstName: "Jamil",
    lastName: "Akter",
    phone: "01521120421",
    bloodGroup: bloodGroup[0],
    activeStatus: activeStatus[0],
    donateFirst: donateFirst[0],
    zilla: zilla[0],
    upozilla: zilla[0]?.upozilla[0],
};


const UpdateProfile = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm({
        defaultValues: defaultValues,
    });

    const onSubmit = (data) => console.log(data);

    // Watch for changes in zilla
    const selectedZilla = watch("zilla");

    // Update upozilla options whenever zilla changes
    useEffect(() => {
        if (selectedZilla) {
            const defaultUpojilla = selectedZilla.upozilla?.[0] || null;
            setValue("upozilla", defaultUpojilla);
        }
    }, [selectedZilla, setValue]);


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
                <div className="grid grid-cols-2 gap-x-5">
                    {/* First Name Field */}
                    <Controller
                        control={control}
                        name="firstName"
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="First Name"
                                size="small"
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

                    {/* Last Name Field */}
                    <Controller
                        control={control}
                        name="lastName"
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Last Name"
                                size="small"
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

                    {/* Phone Field */}
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="number"
                                label="Last Name"
                                size="small"
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

                    {/* Blood Group Field */}
                    <Controller
                        control={control}
                        name="bloodGroup"
                        render={({ field }) => (
                            <Autocomplete
                                {...field}
                                options={bloodGroup}
                                getOptionLabel={(option) => option?.label || "No label"}
                                onChange={(_, value) => setValue("bloodGroup", value)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Blood Group"
                                        size="small"
                                        fullWidth
                                        margin="normal"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#AC0102",
                                                },
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {
                                                color: "#AC0102",
                                            },
                                            "& .MuiOutlinedInput-root.Mui-disabled": {
                                                backgroundColor: "#f5f5f5",
                                            },
                                        }}
                                    />
                                )}
                            />
                        )}
                    />

                    {/* Active Status Field */}
                    <Controller
                        control={control}
                        name="activeStatus"
                        render={({ field }) => (
                            <Autocomplete
                                {...field}
                                options={activeStatus}
                                onChange={(_, value) => setValue("activeStatus", value)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Active Status"
                                        size="small"
                                        fullWidth
                                        margin="normal"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#AC0102",
                                                },
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {
                                                color: "#AC0102",
                                            },
                                            "& .MuiOutlinedInput-root.Mui-disabled": {
                                                backgroundColor: "#f5f5f5",
                                            },
                                        }}
                                    />
                                )}
                            />
                        )}
                    />

                    {/* Donate First Field */}
                    <Controller
                        control={control}
                        name="donateFirst"
                        render={({ field }) => (
                            <Autocomplete
                                {...field}
                                options={donateFirst}
                                getOptionLabel={(option) => option?.label || "No label"}
                                onChange={(_, value) => setValue("donateFirst", value)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Donate First"
                                        size="small"
                                        fullWidth
                                        margin="normal"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#AC0102",
                                                },
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {
                                                color: "#AC0102",
                                            },
                                            "& .MuiOutlinedInput-root.Mui-disabled": {
                                                backgroundColor: "#f5f5f5",
                                            },
                                        }}
                                    />
                                )}
                            />
                        )}
                    />
                </div>

                <Divider textAlign="left" className="pt-4 text-slate-700">Change Donation Place</Divider>


                <div className="grid grid-cols-2 gap-5">
                    {/* Zilla Field */}
                    <Controller
                        control={control}
                        name="zilla"
                        render={({ field }) => (
                            <Autocomplete
                                {...field}
                                options={zilla}
                                getOptionLabel={(option) => option?.label || "No label"}
                                onChange={(_, value) => setValue("zilla", value)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Zilla"
                                        size="small"
                                        fullWidth
                                        margin="normal"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#AC0102",
                                                },
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {
                                                color: "#AC0102",
                                            },
                                            "& .MuiOutlinedInput-root.Mui-disabled": {
                                                backgroundColor: "#f5f5f5",
                                            },
                                        }}
                                    />
                                )}
                            />
                        )}
                    />

                    {/* Upojilla Field */}
                    <Controller
                        control={control}
                        name="upozilla"
                        render={({ field }) => (
                            <Autocomplete
                                {...field}
                                options={selectedZilla ? selectedZilla.upozilla : []}
                                getOptionLabel={(option) => option?.label || "No label"}
                                onChange={(_, value) => setValue("upozilla", value)}
                                disabled={!selectedZilla}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Upojilla"
                                        size="small"
                                        fullWidth
                                        margin="normal"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#AC0102",
                                                },
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {
                                                color: "#AC0102",
                                            },
                                            "& .MuiOutlinedInput-root.Mui-disabled": {
                                                backgroundColor: "#f5f5f5",
                                            },
                                        }}
                                    />
                                )}
                            />
                        )}
                    />
                </div>


                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="contained"
                    color="error"
                    fullWidth
                    sx={{ mt: 2, mb: 3 }}
                >
                    Update Profile
                </Button>
            </form>
        </>
    )
}

export default UpdateProfile;