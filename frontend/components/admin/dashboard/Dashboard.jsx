"use client";

import DataTable from "@/ui/data_table/DataTable";
import CustomModal from "@/ui/modal/CustomDialog";
import { Button } from "@mui/material";
import { useState } from "react";
import CountUp from "react-countup"
import { FaPlus } from "react-icons/fa";
import AddDonation from "./AddDonation";

const Dashboard = () => {
    const [open, setOpen] = useState(false);
    const handleOpenAddNewData = () => setOpen(true);

    return (
        <>
            <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
                <div className="bg-red-200 px-8 py-4 rounded-md text-center">
                    <h4>Number Of Donation</h4>
                    <div className="text-3xl font-semibold text-slate-900"><CountUp end={100} /></div>
                </div>
                <div className="bg-red-200 px-8 py-4 rounded-md text-center">
                    <h4>Next Donation After</h4>
                    <div className="text-3xl font-semibold text-slate-900"><CountUp end={56} /> <span className="text-slate-700">Days</span></div>
                </div>
                <div className="bg-red-200 px-8 py-4 rounded-md text-center">
                    <h4>Active Status</h4>
                    <div className="text-3xl font-semibold text-blue-600">Active</div>
                </div>
            </div>

            <p className="text-4xl text-slate-800 font-semibold my-8">Donation History</p>

            <div className="flex justify-end gap-3 mb-2">
                <Button variant="outlined" size="small" color="error">Download PDF</Button>
                <Button onClick={handleOpenAddNewData} variant="contained" size="small" color="error" className="flex items-center gap-2"><FaPlus /> Add New Date</Button>
            </div>
            <DataTable />

            <CustomModal open={open} setOpen={setOpen} title="Add New Donatioin Date">
                <AddDonation />
            </CustomModal>
        </>
    )
}

export default Dashboard