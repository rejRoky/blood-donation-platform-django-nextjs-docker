"use client";

import {
  TextField,
  Button,
  Typography,
  FormControl,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { IoIosEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone_number: "",
      password: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const response = await signIn("credentials", {
        redirect: false,
        phone_number: formData.phone_number,
        password: formData.password,
      });

      if (response?.error) {
        setError(true);
        toast.error("Incorrect phone or password");
      } else {
        toast.success("Login Successful");
        router.push("/user/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-start mx-8 md:mx-20 h-full relative">
        <div className="water-bg"></div>
        <Typography
          variant="h4"
          className="font-semibold"
          style={{ textAlign: "left" }}
        >
          Login
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 w-full">
          {/* Phone Field */}
          <Controller
            control={control}
            name="phone_number"
            rules={{
              required: "Phone number is required",
            }}
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
                helperText={
                  errors.phone_number ? errors.phone_number.message : ""
                }
                fullWidth
                margin="normal"
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
                value={field.value || ""}
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
                margin="normal"
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
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
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

          {error && (
            <em className="text-xs text-red-600 inline-block mt-4">
              Incorrect phone number or password
            </em>
          )}

          <p className="text-xs mt-2 mb-1">
            <Link
              href="/forgot-password"
              className="text-sky-600 hover:text-sky-700"
            >
              Forgot Password?
            </Link>
          </p>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading && "disabled"}
            sx={{
              marginTop: 2,
              backgroundColor: "#AC0102",
              "&:hover": {
                backgroundColor: "#8B0000",
              },
            }}
          >
            {isLoading ? <CircularProgress size={25} /> : "Login"}
          </Button>
        </form>

        <p className="text-sm my-5">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="underline text-sky-600 hover:text-sky-700"
          >
            Register
          </Link>
        </p>
      </div>
    </>
  );
};

export default LoginForm;
