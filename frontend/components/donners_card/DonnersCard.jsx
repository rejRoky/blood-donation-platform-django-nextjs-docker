"use client";

import lineImg from "@/public/assets/line.png";
import bloodDropImg from "@/public/assets/blood_drop.png";
import badgeImg from "@/public/assets/badge.png";
import Image from "next/image";
import { FaUser, FaPhone } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import Link from "next/link";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { Button } from "@mui/material";

const DonnersCard = () => {
  const { data: usersResponse, isLoading } = useGetAllUsersQuery();

  // Handle both array response and paginated response
  let users = [];
  if (Array.isArray(usersResponse)) {
    users = usersResponse;
  } else if (usersResponse?.data && Array.isArray(usersResponse.data)) {
    users = usersResponse.data;
  }

  return (
    <div className="px-6 md:px-12 mt-12 mb-10">
      <h2 className="text-center uppercase font-bold">Our Donors</h2>
      <Image
        src={lineImg || "/placeholder.svg"}
        alt="line image"
        className="mx-auto -translate-x-2 -translate-y-2"
      />

      {isLoading ? (
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
      ) : (
        <>
          {/* main card */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 gap-y-16 mt-10">
            {users?.length > 0 ? (
              users.slice(0, 8).map((donor) => {
                const isDonationMoreThan5 = donor.donation_count >= 5;
                const showBadge = donor.donation_count >= 1;
                const applyPingAnimation = donor.is_stand_by == 1;

                return (
                  <div
                    className={`${isDonationMoreThan5 ? "pro-card-bg" : "basic-card-bg"} rounded-md shadow-lg relative`}
                    key={donor.id}
                  >
                    <div
                      title={applyPingAnimation ? "Donor Is Stand By" : ""}
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
                      {/* blood group:: */}
                      <strong className="text-[28px] absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[15%] z-30">
                        {donor.blood_group}
                      </strong>
                      <div className="absolute h-[75px] w-[75px] rounded-full secondary-bg left-1/2 -translate-x-[37px] top-4 z-20"></div>
                    </div>

                    {/* user info:: */}
                    <div className="pt-12 pb-3 ps-8 pe-2 relative z-10 card-info rounded-md overflow-hidden backdrop-blur-[2.5px]">
                      <h5 className="text-white font-semibold flex items-start gap-3">
                        <FaUser className="mt-1" /> {donor.first_name}{" "}
                        {donor.last_name}
                      </h5>
                      <p className="text-white text-base flex items-center gap-3 my-2">
                        <FaPhone /> {donor.phone_number}
                      </p>
                      <p className="text-white text-base flex items-center gap-3">
                        <FaLocationDot /> {donor.bn_upazila},{" "}
                        {donor.bn_district}
                      </p>
                    </div>

                    {/* phone number:: */}
                    <div className="absolute top-[10px] right-0 gradient-border-wrapper">
                      <Link
                        href={`tel:+88${donor.phone_number}`}
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
              })
            ) : (
              <div className="col-span-full text-center text-gray-500 py-8">
                <p>No donors found.</p>
              </div>
            )}
          </div>

          {/* Show All Donors Button */}
          {users?.length > 8 && (
            <div className="my-10 text-center">
              <Link href="/donners">
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#B91C1C",
                    "&:hover": { bgcolor: "#a50202" },
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  Show All Donors
                </Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DonnersCard;
