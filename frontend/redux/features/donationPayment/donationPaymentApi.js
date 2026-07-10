const { baseApi } = require("../api/baseApi");

const donationPaymentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    donationPayment: builder.mutation({
      query: (data) => ({
        url: `/payment/initiate`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useDonationPaymentMutation } = donationPaymentApi;
