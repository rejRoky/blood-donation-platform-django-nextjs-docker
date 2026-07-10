const { baseApi } = require("../api/baseApi");

const donationHistoryApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getDonationHistory: builder.query({
      query: () => ({
        url: "/users/donate/",
        method: "GET",
      }),
      providesTags: ["DonationHistory"],
    }),

    addDonationHistory: builder.mutation({
      query: (data) => ({
        url: "/users/donate/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DonationHistory", "User"],
    }),

    deleteSingleDonationHistory: builder.mutation({
      query: (donationId) => ({
        url: "/users/donate/",
        method: "DELETE",
        body: { donation_id: donationId },
      }),
      invalidatesTags: ["DonationHistory"],
    }),
  }),
});

export const {
  useGetDonationHistoryQuery,
  useAddDonationHistoryMutation,
  useDeleteSingleDonationHistoryMutation,
} = donationHistoryApi;
