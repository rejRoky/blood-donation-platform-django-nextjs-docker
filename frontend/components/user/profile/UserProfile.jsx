"use client";

import { FaUser } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import { Button, Switch } from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";
import UpdateUserProfile from "./UpdateUserProfile";
import { FaDroplet } from "react-icons/fa6";
import { RiRadioButtonLine } from "react-icons/ri";
import CustomDialog from "@/ui/modal/CustomDialog";
import { useSession } from "next-auth/react";
import UserProfileSkeliton from "@/ui/skeliton/UserProfileSkeliton";
import {
  useGetLoginUserQuery,
  useUpdateUserProfileDataMutation,
} from "@/redux/features/user/userApi";
import { useGetDonationHistoryQuery } from "@/redux/features/donationHistory/donationHistoryApi";

const UserProfile = () => {
  const [open, setOpen] = useState(false);
  const handleOpenUpdateProfile = () => setOpen(true);
  const { data } = useSession();
  const sessionUserId = data?.user?.id;
  const { data: logedInUser, isLoading: isLoadingLogedInUser } =
    useGetLoginUserQuery(sessionUserId, { skip: !sessionUserId });
  const user = logedInUser?.user;
  
  const { data: donationHistoryData } = useGetDonationHistoryQuery(
    sessionUserId,
    {
      skip: !sessionUserId,
    }
  );
  const donationHistory = donationHistoryData?.data;

  const latestDonation = donationHistory?.reduce((latest, current) => {
    return current.id > latest.id ? current : latest;
  }, donationHistory?.[0]);
  const firstLetter = user?.first_name.slice(0, 1);
  const lastLetter = user?.last_name.slice(0, 1);

  const [updateUserMode] = useUpdateUserProfileDataMutation();

  const handleToggleSwitch = async (field, value) => {
    if (field == "is_active" && value == 1) {
      const today = new Date();
      const nextDonationDate = new Date(latestDonation?.countdown_end_date);

      if (nextDonationDate > today) {
        Swal.fire({
          icon: "warning",
          title: "Not Allowed",
          text: "You can't activate now. Next donation date hasn't arrived yet.",
        });
        return;
      }
    }

    const data =
      field == "is_active"
        ? {
            is_active: value,
            update_manually: 1,
          }
        : {
            [field]: value,
          };

    try {
      const res = await updateUserMode({
        id: user?.id,
        data,
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: res?.message || "User mode updated",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.data?.message || "Something went wrong",
      });
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  if (!sessionUserId || isLoadingLogedInUser) {
    return <UserProfileSkeliton />;
  }

  if (user) {
    return (
      <>
        <div className="grid lg:grid-cols-2 gap-x-6 lg:gap-x-0 mb-4">
          <div className="sm:flex lg:justify-between gap-x-8 lg:gap-x-0 w-full mb-4 lg:mb-0">
            <div className="flex items-center mb-2 sm:mb-0">
              Stand By Mode{" "}
              <Switch
                checked={user?.is_stand_by == 1}
                onChange={() =>
                  handleToggleSwitch(
                    "is_stand_by",
                    user?.is_stand_by == 1 ? 0 : 1
                  )
                }
              />
              <FaDroplet className="text-red-600 text-xl" />
            </div>

            <div className="flex items-center">
              Active Status{" "}
              <Switch
                checked={user?.is_active == 1}
                onChange={() =>
                  handleToggleSwitch("is_active", user?.is_active == 1 ? 0 : 1)
                }
              />
              <RiRadioButtonLine className="text-red-600 text-2xl" />
            </div>
          </div>
          <div className="flex sm:justify-end gap-x-3">
            <Button
              variant="contained"
              color="error"
              onClick={handleOpenUpdateProfile}
            >
              Update Profile
            </Button>
            {/* delete button will add */}
            {/* <Button variant="outlined" color="error" onClick={handleDelete}>
              Delete Account
            </Button> */}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="border border-red-400/30 rounded-md p-5 shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 sm:gap-8">
              <p className="sm:col-span-4 xl:col-span-3 bg-red-400 text-slate-700 leading-normal p-7 text-3xl sm:text-4xl font-bold rounded-full text-center w-24 h-24 sm:w-auto sm:h-auto flex items-center justify-center mx-auto sm:mx-0">
                {firstLetter}
                {lastLetter}
              </p>
              <div className="sm:col-span-8 xl:col-span-9 text-left mx-auto sm:mx-0">
                <p className="flex items-center justify-start gap-3 mb-2">
                  <FaUser className="text-slate-600" />
                  <span className="primary-text">
                    {user?.first_name} {user?.last_name}
                  </span>
                </p>
                <p className="flex items-center justify-start gap-3 mb-2">
                  <FaPhone className="text-slate-600" />
                  <span className="primary-text">{user?.phone_number}</span>
                </p>
                <p className="flex items-center justify-start gap-3">
                  <MdBloodtype className="text-slate-600 text-xl" />
                  <span className="primary-text">{user?.blood_group} (VE)</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border border-red-400/30 rounded-md p-5 shadow-md">
            <p className="font-semibold text-slate-600 text-xl">
              {user?.is_active == 1 ? (
                <span className="text-green-600 font-bold">Active</span>
              ) : (
                <span className="text-red-700 font-bold">Inactive</span>
              )}
            </p>
            <p className="font-semibold text-slate-600">
              Donation Place:{" "}
              <span className="primary-text">
                {user?.upazila.bn_name}-{user?.district.bn_name}
              </span>
            </p>

            <p className="font-semibold text-slate-600">
              Last donation date:{" "}
              <span className="primary-text">
                {latestDonation?.last_donation_date
                  ? new Date(latestDonation.last_donation_date).toLocaleString(
                      "bn-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "N/A"}
              </span>
            </p>
            <p className="font-semibold text-slate-600">
              Next donation after:{" "}
              <span className="primary-text">
                <span className="primary-text">
                  {latestDonation?.countdown_end_date
                    ? new Date(
                        latestDonation.countdown_end_date
                      ).toLocaleString("bn-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
              </span>
            </p>
          </div>
        </div>

        <CustomDialog open={open} setOpen={setOpen} title="Update Profile">
          <UpdateUserProfile user={user} setOpen={setOpen} />
        </CustomDialog>
      </>
    );
  }
};

export default UserProfile;
