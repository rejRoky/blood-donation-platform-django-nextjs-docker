"use client";

import {
  TextField,
  Button,
  Typography,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { IoIosEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import Link from "next/link";
import { useRegisterUserMutation } from "@/redux/features/user/userApi";
import {
  useGetDistrictQuery,
  useGetUpozillaQuery,
} from "@/redux/features/area/areaApi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

const bloodGroup = [
  { label: "A+ (Ve)", value: "A+", id: 1 },
  { label: "A- (Ve)", value: "A-", id: 2 },
  { label: "B+ (Ve)", value: "B+", id: 3 },
  { label: "B- (Ve)", value: "B-", id: 4 },
  { label: "AB+ (Ve)", value: "AB+", id: 5 },
  { label: "AB- (Ve)", value: "AB-", id: 6 },
  { label: "O+ (Ve)", value: "O+", id: 7 },
  { label: "O- (Ve)", value: "O-", id: 8 },
];

const RegisterForm = () => {
  const [districtId, setDistrictId] = useState(null);
  const { data: districtData, isLoading: districsDataLoading } =
    useGetDistrictQuery();
  const districts = Array.isArray(districtData)
    ? districtData
    : districtData?.data || [];

  const { data: upozillaResponse, isLoading: upozillaDataLoading } =
    useGetUpozillaQuery(districtId, {
      skip: !districtId,
    });
  const upozillas = upozillaResponse?.data || [];

  const [userRegister, { isLoading, isSuccess, isError, error }] =
    useRegisterUserMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirm = () => setShowConfirm(!showConfirm);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone_number: "",
      bloodGroup: null,
      district_id: null,
      upazila_id: null,
      terms: false,
      password: "",
      confirm: "",
    },
  });

  const onSubmit = (formData) => {
    const userInfo = {
      first_name: formData?.firstName,
      last_name: formData?.lastName,
      phone_number: formData?.phone_number,
      blood_group: formData?.bloodGroup.value,
      district_id: formData?.district_id?.id,
      upazila_id: formData?.upazila_id?.id,
      password: formData?.password,
    };

    userRegister(userInfo);
  };

  useEffect(() => {
    if (isError && error) {
      toast.error(error?.data?.message || "Something went wrong");

      if (error?.data?.errors) {
        const validationErrors = error.data.errors;
        Object.keys(validationErrors).forEach((fieldName) => {
          const messages = validationErrors[fieldName];
          if (messages.length > 0) {
            setError(fieldName, {
              type: "server",
              message: messages[0],
            });
          }
        });
      }
    }
  }, [isError, error, setError]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("User Has Successfully Registered!!");
      return redirect("/login");
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col justify-center items-start mx-8 md:mx-20 h-full pt-0 md:pt-10 relative">
      <div className="water-bg"></div>
      <Typography variant="h4" className="font-semibold">
        Donor Registration
      </Typography>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-2 w-full md:grid md:grid-cols-2 gap-x-4"
      >
        {/* First Name Field */}
        <Controller
          control={control}
          name="firstName"
          rules={{ required: "First name is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label={
                <>
                  First name <span className="text-red-500">*</span>
                </>
              }
              size="small"
              error={!!errors.firstName}
              helperText={errors.firstName ? errors.firstName.message : ""}
              fullWidth
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: errors.firstName ? "#D32F2F" : "#AC0102",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: errors.firstName ? "#D32F2F" : "#AC0102",
                },
                "& .MuiOutlinedInput-root.Mui-disabled": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            />
          )}
        />

        {/* Last Name Field */}
        <Controller
          control={control}
          name="lastName"
          rules={{ required: "Last name is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label={
                <>
                  Last name <span className="text-red-500">*</span>
                </>
              }
              size="small"
              error={!!errors.lastName}
              helperText={errors.lastName ? errors.lastName.message : ""}
              fullWidth
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: errors.lastName ? "#D32F2F" : "#AC0102",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: errors.lastName ? "#D32F2F" : "#AC0102",
                },
                "& .MuiOutlinedInput-root.Mui-disabled": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            />
          )}
        />

        {/* Phone Field */}
        <Controller
          control={control}
          name="phone_number"
          rules={{ required: "Phone number is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label={
                <>
                  Phone Number <span className="text-red-500">*</span>{" "}
                </>
              }
              size="small"
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                  color: "#6B7280",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#dc2626",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#AC0102",
                  },
                },
              }}
              margin="normal"
            />
          )}
        />

        {/* Blood Group Field */}
        <Controller
          control={control}
          name="bloodGroup"
          rules={{ required: "Blood group is required" }}
          render={({ field }) => (
            <Autocomplete
              fullWidth
              {...field}
              value={field.value || null}
              options={bloodGroup}
              getOptionLabel={(option) => option?.label || "No label"}
              onChange={(_, value) => setValue("bloodGroup", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    <>
                      Blood Group <span className="text-red-500">*</span>
                    </>
                  }
                  error={!!errors.bloodGroup}
                  helperText={
                    errors.bloodGroup ? errors.bloodGroup.message : ""
                  }
                  size="small"
                  margin="normal"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: errors.bloodGroup ? "#D32F2F" : "#AC0102",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: errors.bloodGroup ? "#D32F2F" : "#AC0102",
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

        <Divider className="pt-4 md:col-span-2 text-slate-700">
          Where you want to donate
        </Divider>

        {/* district Field */}
        <Controller
          control={control}
          name="district_id"
          rules={{ required: "District is required" }}
          render={({ field }) => (
            <Autocomplete
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                  color: "#6B7280",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#dc2626",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#AC0102",
                  },
                },
              }}
              {...field}
              value={field.value || null}
              options={districsDataLoading ? [] : districts || []}
              loading={districsDataLoading}
              getOptionLabel={(option) =>
                `${option?.bn_name || ""}-${option?.name || ""}`
              }
              onChange={(_, value) => {
                setValue("district_id", value);
                setDistrictId(value?.id || null);
                setValue("upazila_id", null);
              }}
              renderInput={(params) => {
                const { InputProps, ...rest } = params;
                return (
                  <TextField
                    {...rest}
                    label={
                      <>
                        Preferred District{" "}
                        <span className="text-red-500">*</span>
                      </>
                    }
                    error={!!errors.district_id}
                    helperText={errors.district_id?.message}
                    size="small"
                    margin="normal"
                    InputProps={{
                      ...InputProps,
                      endAdornment: (
                        <>
                          {districsDataLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                );
              }}
            />
          )}
        />

        {/* Upazila Field */}
        <Controller
          control={control}
          name="upazila_id"
          rules={{ required: "Upazila is required" }}
          render={({ field }) => (
            <Autocomplete
              {...field}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                  color: "#6B7280",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#dc2626",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#AC0102",
                  },
                },
              }}
              value={field.value || null}
              options={upozillas}
              getOptionLabel={(option) =>
                `${option?.bn_name || ""} - ${option?.name || ""}`
              }
              onChange={(_, value) => setValue("upazila_id", value)}
              disabled={!districtId || upozillaDataLoading}
              renderInput={(params) => {
                const { InputProps, ...rest } = params;
                return (
                  <TextField
                    {...params}
                    label={
                      <>
                        Preferred Area <span className="text-red-500">*</span>
                      </>
                    }
                    error={!!errors.upazila_id}
                    helperText={errors.upazila_id?.message}
                    size="small"
                    margin="normal"
                    InputProps={{
                      ...InputProps,
                      endAdornment: (
                        <>
                          {upozillaDataLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                );
              }}
            />
          )}
        />

        {/* password field */}
        <Controller
          control={control}
          name="password"
          defaultValue=""
          rules={{
            required: "Password is required",
          }}
          render={({ field }) => (
            <FormControl
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                mt: 2,
                "& .MuiInputLabel-root": {
                  color: "#6B7280",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#dc2626",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#AC0102",
                  },
                },
              }}
              error={!!errors.password}
            >
              <InputLabel htmlFor="password">
                Password <span className="text-red-500">*</span>
              </InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? "text" : "password"}
                {...field}
                label="Password *"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <IoIosEyeOff /> : <IoMdEye />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errors.password && (
                <span className="text-red-500 text-xs ms-3.5 mt-1">
                  {errors.password.message}
                </span>
              )}
            </FormControl>
          )}
        />

        {/* confirm password field */}
        <Controller
          control={control}
          name="confirm"
          defaultValue=""
          rules={{
            required: "Confirm password is required",
            validate: (value) =>
              value == watch("password") || "Passwords must match",
          }}
          render={({ field }) => (
            <FormControl
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                mt: 2,
                "& .MuiInputLabel-root": {
                  color: "#6B7280",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#dc2626",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#AC0102",
                  },
                },
              }}
              error={!!errors.confirm}
            >
              <InputLabel htmlFor="confirm">
                Confirm Password <span className="text-red-500">*</span>
              </InputLabel>
              <OutlinedInput
                id="confirm"
                type={showConfirm ? "text" : "password"}
                {...field}
                label="Confirm Password *"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowConfirm} edge="end">
                      {showConfirm ? <IoIosEyeOff /> : <IoMdEye />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errors.confirm && (
                <span className="text-red-500 text-xs ms-3.5 mt-1">
                  {errors.confirm.message}
                </span>
              )}
            </FormControl>
          )}
        />

        <div className="col-span-2 mt-2">
          <Controller
            control={control}
            name="terms"
            rules={{ required: "You must accept the terms and conditions" }}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox {...field} checked={field.value} color="primary" />
                }
                label={
                  <span>
                    I agree to the{" "}
                    <Link href="/terms" className="underline text-sky-700">
                      Terms and Conditions
                    </Link>
                  </span>
                }
              />
            )}
          />
          {errors.terms && (
            <Typography variant="body2" color="error">
              {errors.terms.message}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              marginTop: 2,
              backgroundColor: "#AC0102",
              "&:hover": { backgroundColor: "#8B0000" },
            }}
          >
            {isLoading ? <CircularProgress size={25} /> : "Register"}
          </Button>
        </div>
      </form>

      <p className="text-sm mt-5 mb-20">
        Already have an account?{" "}
        <Link
          href="/login"
          className="underline text-sky-600 hover:text-sky-700"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
