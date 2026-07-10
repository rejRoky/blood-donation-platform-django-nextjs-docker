"use client";

import {
  useGetDistrictQuery,
  useGetUpozillaQuery,
} from "@/redux/features/area/areaApi";
import { useUpdateUserProfileDataMutation } from "@/redux/features/user/userApi";
import {
  TextField,
  Button,
  Divider,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";

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

const UpdateUserProfile = ({ user, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };
  const [districtId, setDistrictId] = useState(null);
  const { data: districtData, isLoading: districsDataLoading } =
    useGetDistrictQuery();
  const districts = Array.isArray(districtData)
    ? districtData
    : districtData?.data || [];

  const { data: upazillaResponse, isLoading: upozillaDataLoading } =
    useGetUpozillaQuery(districtId, {
      skip: !districtId,
    });
  const upazillas = upazillaResponse?.data || [];

  const [updateUserProfileData] = useUpdateUserProfileDataMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone_number: "",
      blood_group: null,
      district_id: null,
      upazila_id: null,
    },
  });

  useEffect(() => {
    if (user && districts.length > 0) {
      const selectedDistrict = districts.find((d) => d.id == user.district_id);
      const selectedBloodGroup = bloodGroup.find(
        (bg) => bg.value == user.blood_group
      );

      reset({
        firstName: user.first_name,
        lastName: user.last_name,
        phone_number: user.phone_number,
        blood_group: selectedBloodGroup || null,
        district_id: selectedDistrict || null,
        upazila_id: null,
      });

      setDistrictId(selectedDistrict?.id || null);
    }
  }, [user, districts, reset]);

  useEffect(() => {
    if (user?.upazila_id && upazillas.length > 0) {
      const selectedUpazila = upazillas.find((u) => u.id == user.upazila_id);
      if (selectedUpazila) {
        setValue("upazila_id", selectedUpazila);
      }
    }
  }, [upazillas, user?.upazila_id, setValue]);

  //   submit updated data
  const onSubmit = async (data) => {
    const payload = {
      first_name: data.firstName,
      last_name: data.lastName,
      phone_number: data.phone_number,
      blood_group: data.blood_group?.value,
      district_id: data.district_id?.id,
      upazila_id: data.upazila_id?.id,
    };

    handleClose();
    try {
      const res = await updateUserProfileData({
        id: user?.id,
        data: payload,
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: res?.message || "User Profile Updated Successfully",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.data?.message || "Something went wrong",
      });
    }
  };

  if (districsDataLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <CircularProgress />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid sm:grid-cols-2 gap-x-5">
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
            />
          )}
        />
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
            />
          )}
        />
        <Controller
          control={control}
          name="phone_number"
          render={({ field }) => (
            <TextField
              {...field}
              label="Phone Number"
              size="small"
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          control={control}
          name="blood_group"
          rules={{ required: "Required" }}
          render={({ field }) => (
            <Autocomplete
              {...field}
              value={field.value}
              options={bloodGroup}
              onChange={(_, value) => setValue("blood_group", value)}
              getOptionLabel={(option) => option?.label || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Blood Group"
                  size="small"
                  margin="normal"
                />
              )}
            />
          )}
        />
      </div>

      <Divider className="pt-3 text-slate-700">Change Donation Place</Divider>

      <div className="grid sm:grid-cols-2 gap-5">
        <Controller
          control={control}
          name="district_id"
          rules={{ required: "Required" }}
          render={({ field }) => (
            <Autocomplete
              {...field}
              value={field.value}
              options={districts}
              getOptionLabel={(option) =>
                `${option?.bn_name || ""} - ${option?.name || ""}`
              }
              onChange={(_, value) => {
                setValue("district_id", value);
                setDistrictId(value?.id || null);
                setValue("upazila_id", null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Preferred District"
                  size="small"
                  margin="normal"
                />
              )}
            />
          )}
        />

        <Controller
          control={control}
          name="upazila_id"
          rules={{ required: "Required" }}
          render={({ field }) => (
            <Autocomplete
              {...field}
              value={field.value}
              options={upazillas}
              disabled={!districtId || upozillaDataLoading}
              getOptionLabel={(option) =>
                `${option?.bn_name || ""} - ${option?.name || ""}`
              }
              onChange={(_, value) => setValue("upazila_id", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Preferred Area"
                  size="small"
                  margin="normal"
                />
              )}
            />
          )}
        />
      </div>

      <Button
        type="submit"
        variant="contained"
        color="error"
        fullWidth
        sx={{ mt: 2 }}
      >
        Update Profile
      </Button>
    </form>
  );
};

export default UpdateUserProfile;
