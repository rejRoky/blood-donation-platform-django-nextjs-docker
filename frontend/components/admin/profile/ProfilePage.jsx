"use client";

import { FaUser } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import { Button } from "@mui/material";
import { useState } from "react";
import CustomModal from "@/ui/modal/CustomDialog";
import UpdateProfile from "./UpdateProfile";
import Swal from "sweetalert2";

const ProfilePage = () => {
    const [open, setOpen] = useState(false);
    const handleOpenUpdateProfile = () => setOpen(true);

    const handleDelete = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-5">
                <div className="border border-red-400/30 rounded-md p-5 shadow-md">
                    <div className="flex items-center gap-8">
                        {/* <div className="h-28 w-28 rounded-full bg-red-500"></div> */}
                        <p className="p-8 rounded-full bg-red-400 text-slate-700 text-4xl font-bold">JA</p>
                        <div>
                            <p className="flex items-center gap-3"><FaUser className="text-slate-600" /> <span className="primary-text">Md. jamil Akter</span></p>
                            <p className="flex items-center gap-3"><FaPhone className="text-slate-600" /> <span className="primary-text">01521102421</span></p>
                            <p className="flex items-center gap-3"><MdBloodtype className="text-slate-600 text-xl" /> <span className="primary-text">A+ (Ve)</span></p>
                        </div>
                    </div>
                </div>
                <div className="border border-red-400/30 rounded-md p-5 shadow-md">
                    <p className="font-semibold text-slate-600">Donation Place: <span className="primary-text">Rajshahi</span></p>
                    <p className="font-semibold text-slate-600">Activity: <span className="primary-text">Active</span></p>
                    <p className="font-semibold text-slate-600">Donate First: <span className="primary-text">Yes</span></p>
                    <p className="font-semibold text-slate-600">Last donation date: <span className="primary-text">21-Nov-2024</span></p>
                    <p className="font-semibold text-slate-600">Next donation date: <span className="primary-text">23-Mar-2025</span></p>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
                <Button variant="contained" color="error" onClick={handleOpenUpdateProfile}>Update Profile</Button>
                <Button variant="outlined" color="error" onClick={handleDelete}>Delete Account</Button>
            </div>

            <CustomModal open={open} setOpen={setOpen} title="Update Profile">
                <UpdateProfile />
            </CustomModal>
        </>
    )
}

export default ProfilePage;