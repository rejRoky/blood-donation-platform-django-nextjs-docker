"use client";

import React, { useState } from "react";
import DataTable from "@/ui/data_table/DataTable";
import CustomModal from "@/ui/modal/CustomDialog";
import { Button, Skeleton, Box } from "@mui/material";
import CountUp from "react-countup";
import { FaPlus } from "react-icons/fa";
import AddNewDonation from "./AddNewDonation";
import { useSession } from "next-auth/react";
import { useGetDonationHistoryQuery } from "@/redux/features/donationHistory/donationHistoryApi";
import { useGetLoginUserQuery } from "@/redux/features/user/userApi";
import dayjs from "dayjs";

const UserDashboard = () => {
  const [open, setOpen] = useState(false);
  const handleOpenAddNewData = () => setOpen(true);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: donationHistoryData, isLoading, isUninitialized } = useGetDonationHistoryQuery(userId, {
    skip: !userId,
  });
  const donationHistory = donationHistoryData?.data ?? [];

  const { data: isActiveStatus } = useGetLoginUserQuery(userId, {
    skip: !userId,
    selectFromResult: ({ data }) => ({
      data: data?.user?.is_active,
    }),
  });
  const isUserActive = isActiveStatus == 1;

  const latestDonation = donationHistory.reduce(
    (latest, current) => (current.id > (latest?.id ?? 0) ? current : latest),
    donationHistory[0] || {}
  );

  const nowStart = dayjs().startOf('day');
  const endStart = dayjs(latestDonation.countdown_end_date).startOf('day');
  const remainingDays = endStart.diff(nowStart, 'day');

  if (isUninitialized || isLoading) {
    return (
      <Box>
        {/* Skeliton design */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2 }}>
          {[...Array(3)].map((_, idx) => (
            <Box key={idx} sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
            </Box>
          ))}
        </Box>

        <Skeleton variant="text" width="45%" height={40} sx={{ mt: 4 }} />

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1, mb: 2 }}>
          <Skeleton variant="rectangular" width={140} height={32} />
        </Box>

        <Box sx={{ border: 1, borderColor: "grey.300", borderRadius: 1, overflow: "hidden" }}>
          {[...Array(5)].map((_, rowIdx) => (
            <Box key={rowIdx} sx={{ display: "flex", gap: 2, p: 1, borderBottom: 1, borderColor: "grey.200" }}>
              {Array(4).fill("").map((__, cellIdx) => (
                <Skeleton key={cellIdx} variant="text" width={`${100 / 4}%`} height={20} />
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  const shouldShowMessage = (remainingDays > 0) || !isUserActive;
  const message = shouldShowMessage ? (
    <p className="text-center my-2 text-red-600 font-semibold">
      Only active users can add a new date
    </p>
  ) : null;

  return (
    <>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-red-200 px-8 py-4 rounded-md text-center">
          <h4>Number Of Donation</h4>
          <div className="text-3xl font-semibold text-slate-900">
            <CountUp end={donationHistory.length} />
          </div>
        </div>

        <div className="bg-red-200 px-8 py-4 rounded-md text-center">
          <h4>Next Donation After</h4>
          <div className="text-3xl font-semibold text-slate-900">
            <CountUp end={remainingDays >= 0 ? remainingDays : 0} />
            <span className="text-slate-700 ms-1">
              {remainingDays <= 1 ? "Day" : "Days"}
            </span>
          </div>
        </div>

        <div className="bg-red-200 px-8 py-4 rounded-md text-center">
          <h4>Active Status</h4>
          {isUserActive ? (
            <strong className="text-green-600 text-3xl">Active</strong>
          ) : (
            <strong className="text-red-700 text-3xl">Inactive</strong>
          )}
        </div>
      </div>

      <p className="text-4xl text-slate-800 font-semibold my-8">
        Donation History
      </p>

      <div className="flex justify-end gap-3 mb-2">
        <Button
          disabled={remainingDays > 0 || !isUserActive}
          onClick={handleOpenAddNewData}
          variant="contained"
          size="small"
          color="error"
          className="flex items-center gap-2"
        >
          <FaPlus /> Add New Date
        </Button>
      </div>

      {message}

      <DataTable isLoading={isLoading} donationHistory={donationHistory} />

      <CustomModal open={open} setOpen={setOpen} title="Add New Donation Date">
        <AddNewDonation userId={userId} setOpen={setOpen} />
      </CustomModal>
    </>
  );
};

export default UserDashboard;
