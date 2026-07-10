const { baseApi } = require("../api/baseApi");

const donationHistoryApi=baseApi.injectEndpoints({
    overrideExisting:true,
    endpoints:(builder)=>({
        getDonationHistory:builder.query({
            query:(userId)=>({
                url:`/donation-history/${userId}`,
                method:"GET"
            }),
            providesTags:["DonationHistory"]
        }),

        addDonationHistory:builder.mutation({
            query:(data)=>({
                url:'/donation-history-add',
                method:"POST",
                body:data
            }),
            invalidatesTags:["DonationHistory","User"]
        }),

        deleteSingleDonationHistory:builder.mutation({
            query:(donationId)=>({
                url:`/donation-history-delete/${donationId}`,
                method:"POST"
            }),
            invalidatesTags:["DonationHistory"]
        })
    })
});

export const {useGetDonationHistoryQuery,useAddDonationHistoryMutation, useDeleteSingleDonationHistoryMutation}=donationHistoryApi;