import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession, signOut } from "next-auth/react";
import Swal from "sweetalert2";

const isMultipartFormDataEndpoint = (endpoint) => {
  const multipartEndpoints = ["uploadAvatar"];
  return multipartEndpoints.includes(endpoint);
};

const baseQuery = fetchBaseQuery({
  baseUrl: "https://blood.rajbilling.com/api",
  prepareHeaders: async (headers, { getState, endpoint }) => {
    const session = await getSession();

    if (session?.accessToken) {
      headers.set("Authorization", `Bearer ${session.accessToken}`);
    }

    headers.set("Accept", "application/json");

    if (isMultipartFormDataEndpoint(endpoint)) {
      headers.set("Content-Type", "multipart/form-data");
    } else {
      headers.set("Accept", "application/json");
    }
    return headers;
  },
});

/**
 * Enhanced base query with custom error handling.
 * Call Logout dispatch when 401 status code received.
 */
const enhancedBaseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  const errorData = result?.error;

  if (
    errorData?.data?.message == "Unauthenticated." &&
    errorData?.status == 401
  ) {
    Swal.fire({
      title: "Oops!😔",
      text: "Session Has Been Expired!",
      icon: "error",
    });
    signOut({ redirect: true, callbackUrl: "/login" });
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["User", "DonationHistory"],

  baseQuery: enhancedBaseQuery,
  endpoints: () => ({}),
});
