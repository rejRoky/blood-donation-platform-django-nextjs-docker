import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";

import { useDeleteSingleDonationHistoryMutation } from "@/redux/features/donationHistory/donationHistoryApi";
import { useUpdateUserProfileDataMutation } from "@/redux/features/user/userApi";

export default function DataTable({ isLoading, donationHistory }) {
  const [deleteSingle] = useDeleteSingleDonationHistoryMutation();
  const [updateUserMode] = useUpdateUserProfileDataMutation();

  // Get the latest donation entry
  const latestDonation = donationHistory?.reduce((latest, current) => {
    return current.id > latest.id ? current : latest;
  }, donationHistory?.[0]);

  // Handle deleting a single donation record
  const handleDeleteTableRow = async (id) => {
    try {
      const res = await deleteSingle(id).unwrap();

      if (id == latestDonation?.id) {
        const data = { is_active: 1 };
        await updateUserMode({
          id: latestDonation?.user_id,
          data,
        }).unwrap();
      }

      Swal.fire({
        title: "Deleted!",
        text: res?.message || "Donation history deleted successfully.",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.data?.message || "Failed to delete donation history.",
        icon: "error",
      });
      console.error("Delete failed:", error);
    }
  };

  // Define DataGrid columns
  const columns = [
    {
      field: "Sl",
      headerName: "SL",
      hide: true,
      width: 120,
      headerClassName: "bg-red-50 text-base font-bold text-slate-800",
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: "last_donation_date",
      headerName: "Donation Date",
      width: 250,
      headerClassName: "bg-red-50 text-base font-bold text-slate-800",
    },
    {
      field: "blood_amount",
      headerName: "Donated Blood (ML)",
      width: 206,
      headerClassName: "bg-red-50 text-base font-bold text-slate-800",
      renderCell: (params) => `${params.value} ml`,
    },
    {
      field: "note",
      headerName: "Donor's Note",
      width: 348,
      headerClassName: "bg-red-50 text-base font-bold text-slate-800",
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 177,
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      headerClassName: "bg-red-50 text-base font-bold text-slate-800",
      renderCell: (params) => {
        const handleDelete = async () => {
          const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
          });

          if (result.isConfirmed) {
            await handleDeleteTableRow(params.id);
          }
        };

        return (
          <div className="flex justify-center items-center w-full h-full">
            <button
              onClick={handleDelete}
              className="text-red-600 hover:bg-red-100 p-2 rounded-full"
              title="Delete Donation"
            >
              <FaTrashAlt />
            </button>
          </div>
        );
      },
    },
  ];

  // Loader
  if (isLoading) {
    return (
      <div className="w-full flex justify-center mt-10">
        <video
          src="/assets/loader.mp4"
          height={200}
          width={200}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    );
  }

  // Render DataGrid
  return (
    <div style={{ width: "100%" }}>
      <div className="flex flex-col h-auto">
        <DataGrid
          rows={donationHistory}
          columns={columns}
          pageSize={10}
          disableRowSelectionOnClick
          className="flex-1"
        />
      </div>
    </div>
  );
}
