"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaUser, FaPhone } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Autocomplete, TextField, Pagination, Box } from "@mui/material";
import bloodDropImg from "@/public/assets/blood_drop.png";
import badgeImg from "@/public/assets/badge.png";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import {
  useGetDistrictQuery,
  useGetUpozillaQuery,
} from "@/redux/features/area/areaApi";

const bloodGroup = [
  { label: "A+ (Ve)", value: "A+" },
  { label: "A- (Ve)", value: "A-" },
  { label: "B+ (Ve)", value: "B+" },
  { label: "B- (Ve)", value: "B-" },
  { label: "AB+ (Ve)", value: "AB+" },
  { label: "AB- (Ve)", value: "AB-" },
  { label: "O+ (Ve)", value: "O+" },
  { label: "O- (Ve)", value: "O-" },
];

export default function DonorsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedUpozilla, setSelectedUpozilla] = useState(null);
  const [districtId, setDistrictId] = useState(null);

  // Build query parameters — filtering & pagination happen server-side
  const itemsPerPage = 20;
  const queryParams = {
    page: currentPage,
    page_size: itemsPerPage,
    ...(selectedBloodGroup && { blood_group: selectedBloodGroup.value }),
    ...(selectedDistrict && { district_id: selectedDistrict.id }),
    ...(selectedUpozilla && { upazila_id: selectedUpozilla.id }),
  };

  const {
    data: usersResponse = [],
    isLoading: usersLoading,
    refetch,
  } = useGetAllUsersQuery(queryParams);
  const { data: districtRes = {}, isLoading: districtLoading } =
    useGetDistrictQuery();
  const districts = Array.isArray(districtRes)
    ? districtRes
    : Array.isArray(districtRes?.data)
      ? districtRes.data
      : [];

  const { data: upozillaRes = {}, isLoading: upozillaLoading } =
    useGetUpozillaQuery(districtId, {
      skip: !districtId,
    });
  const upozillas = Array.isArray(upozillaRes)
    ? upozillaRes
    : Array.isArray(upozillaRes?.data)
      ? upozillaRes.data
      : [];

  const handleClear = () => {
    setSelectedBloodGroup(null);
    setSelectedDistrict(null);
    setSelectedUpozilla(null);
    setDistrictId(null);
    setCurrentPage(1);
    // Refetch data after clearing filters
    refetch();
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType == "bloodGroup") {
      setSelectedBloodGroup(value);
    } else if (filterType == "district") {
      setSelectedDistrict(value);
      setDistrictId(value?.id || null);
      setSelectedUpozilla(null);
    } else if (filterType == "upazila") {
      setSelectedUpozilla(value);
    }

    setCurrentPage(1);
    // Refetch data after filter change
    setTimeout(() => refetch(), 100);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Refetch data for new page
    refetch();
  };

  const isClearButtonVisible =
    selectedBloodGroup || selectedDistrict || selectedUpozilla;

  // Standby donors first, then most donations — within the current page
  const sortDonors = (list) =>
    [...list].sort((a, b) => {
      const standbyA = a.is_donate ? 1 : 0;
      const standbyB = b.is_donate ? 1 : 0;
      if (standbyA !== standbyB) {
        return standbyB - standbyA;
      }
      return (b.donation_count || 0) - (a.donation_count || 0);
    });

  let donors = [];
  let totalPages = 1;
  let totalDonors = 0;
  let from = 0;
  let to = 0;

  if (Array.isArray(usersResponse?.results)) {
    // Paginated response: {count, next, previous, results}
    // Filtering already happened server-side via queryParams.
    donors = sortDonors(usersResponse.results);
    totalDonors = usersResponse.count || 0;
    totalPages = Math.max(1, Math.ceil(totalDonors / itemsPerPage));
    from = totalDonors === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    to = Math.min(currentPage * itemsPerPage, totalDonors);
  } else if (Array.isArray(usersResponse)) {
    // Plain array fallback
    const filteredDonors = sortDonors(
      usersResponse.filter((donor) => donor.is_active)
    );
    totalDonors = filteredDonors.length;
    totalPages = Math.max(1, Math.ceil(totalDonors / itemsPerPage));
    from = totalDonors === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    to = Math.min(currentPage * itemsPerPage, totalDonors);

    const startIndex = (currentPage - 1) * itemsPerPage;
    donors = filteredDonors.slice(startIndex, startIndex + itemsPerPage);
  }

  return (
    <>
      <div className="donor-parallax h-[150px]">
        <div className="h-full w-full backdrop-blur-sm flex flex-col justify-center items-center bg-black/50 text-white text-4xl font-bold text-center">
          <h3 className="text-white">All donors</h3>
          <p className="text-sm font-normal mt-2">{totalDonors} donors found</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 md:p-12 flex items-center justify-center gap-5 flex-wrap">
        <Autocomplete
          sx={{ width: 300 }}
          value={selectedBloodGroup}
          options={bloodGroup}
          getOptionLabel={(option) => option?.label || ""}
          onChange={(_, value) => handleFilterChange("bloodGroup", value)}
          renderInput={(params) => (
            <TextField {...params} label="Select Blood Group" size="small" />
          )}
        />
        <Autocomplete
          sx={{ width: 300 }}
          options={districts}
          value={selectedDistrict}
          getOptionLabel={(option) =>
            typeof option == "string"
              ? option
              : `${option?.bn_name || ""} - ${option?.name || ""}`
          }
          onChange={(_, value) => handleFilterChange("district", value)}
          renderInput={(params) => (
            <TextField {...params} label="Select District" size="small" />
          )}
        />
        <Autocomplete
          sx={{ width: 300 }}
          options={upozillas}
          value={selectedUpozilla}
          getOptionLabel={(option) =>
            typeof option == "string"
              ? option
              : `${option?.bn_name || ""} - ${option?.name || ""}`
          }
          onChange={(_, value) => handleFilterChange("upazila", value)}
          renderInput={(params) => (
            <TextField {...params} label="Select Area" size="small" />
          )}
          disabled={!selectedDistrict}
        />
        {isClearButtonVisible && (
          <button
            onClick={handleClear}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Donor Cards */}
      <div className="px-6 md:px-12 mt-10 mb-10">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 gap-y-16 mt-10">
          {donors?.map((donor) => {
            const isDonationMoreThan5 = donor.donation_count >= 5;
            const showBadge = donor.donation_count >= 1;
            const applyPingAnimation = donor.is_donate;

            return (
              <div
                className={`${isDonationMoreThan5 ? "pro-card-bg" : "basic-card-bg"} rounded-md shadow-lg relative`}
                key={donor.id}
              >
                <div
                  title={applyPingAnimation ? "Stand by donor" : ""}
                  className="absolute -top-12 left-5 cursor-default"
                >
                  <span className="relative flex w-16 z-30">
                    <Image
                      src={bloodDropImg || "/placeholder.svg"}
                      alt="blood drop image"
                      className={`absolute w-[44px] left-[10px] top-4 ${applyPingAnimation ? "animate-ping" : ""}`}
                    />
                    <Image
                      src={bloodDropImg || "/placeholder.svg"}
                      alt="blood drop image"
                      className="w-56 relative z-30"
                    />
                  </span>
                  <strong className="text-[28px] absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[15%] z-30">
                    {donor.blood_group}
                  </strong>
                  <div className="absolute h-[75px] w-[75px] rounded-full secondary-bg left-1/2 -translate-x-[37px] top-4 z-20"></div>
                </div>

                {/* user info */}
                <div className="pt-12 pb-3 ps-8 pe-2 relative z-10 card-info rounded-md overflow-hidden backdrop-blur-[2.5px]">
                  <h5 className="text-white font-semibold flex items-start gap-3">
                    <FaUser className="mt-1" /> {donor.first_name}{" "}
                    {donor.last_name}
                  </h5>
                  <p className="text-white text-base flex items-center gap-3 my-2">
                    <FaPhone /> {donor.mobile_number}
                  </p>
                  <p className="text-white text-base flex items-center gap-3">
                    <FaLocationDot /> {donor.bn_upazila}, {donor.bn_district}
                  </p>
                </div>

                {/* phone number */}
                <div className="absolute top-[10px] right-0 gradient-border-wrapper">
                  <Link
                    href={`tel:+88${donor.mobile_number}`}
                    className="group w-[100px] flex items-center gap-2 text-center text-white bg-gradient-to-r from-[#d40606] to-[#020024ab] relative z-20 rounded-l-md text-sm p-1 font-semibold hover:brightness-110 transition shadow-lg"
                  >
                    Call Now
                    <FaPhone className="animate-phone-ring text-white group-hover:drop-shadow-[0_0_6px_white] duration-100" />
                  </Link>
                </div>

                {showBadge && (
                  <div className="absolute -bottom-6 -right-4 z-10">
                    <Image
                      src={badgeImg || "/placeholder.svg"}
                      alt="Badge image"
                      className="w-10"
                    />
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-2/3 -translate-y-2/3 text-white text-sm">
                      {donor.donation_count}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {usersLoading && (
            <div className="col-span-full text-center text-gray-500 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p>Finding Donors...</p>
            </div>
          )}

          {!usersLoading && donors?.length == 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              <p className="text-lg">No donors found.</p>
              <p className="text-sm mt-2">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="mt-10">
          <div className="text-center text-gray-600 mb-4">
            {!usersLoading && (
              <p>
                Showing {from} to {to} of {totalDonors} donors
                {currentPage > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </p>
            )}
          </div>
        </div>

        {!usersLoading && totalPages > 1 && (
          <div className="pb-10">
            <Box display="flex" justifyContent="center">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#d40606",
                    "&.Mui-selected": {
                      backgroundColor: "#d40606",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#b30505",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "rgba(212, 6, 6, 0.1)",
                    },
                  },
                }}
              />
            </Box>
          </div>
        )}
      </div>
    </>
  );
}
