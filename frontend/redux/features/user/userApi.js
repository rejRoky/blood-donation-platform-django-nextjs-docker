const { baseApi } = require("../api/baseApi");

const userApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.blood_group) searchParams.append("blood_group", params.blood_group);
        if (params.district_id) searchParams.append("district_id", params.district_id.toString());
        if (params.upazila_id) searchParams.append("upazila_id", params.upazila_id.toString());
        return {
          url: `/users/?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),

    registerUser: builder.mutation({
      query: (data) => ({
        url: "/users/register/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    loginUser: builder.mutation({
      query: (data) => ({
        url: "/users/login/",
        method: "POST",
        body: data,
      }),
    }),

    getLoginUser: builder.query({
      query: () => ({
        url: "/users/profile/",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateUserProfileData: builder.mutation({
      query: (data) => ({
        url: "/users/profile/",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    sendResetOtp: builder.mutation({
      query: (data) => ({
        url: "/users/send-reset-password-otp/",
        method: "POST",
        body: data,
      }),
    }),

    verifyResetOtp: builder.mutation({
      query: (data) => ({
        url: "/users/verify-reset-password-otp/",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/users/reset-password/",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetLoginUserQuery,
  useSendResetOtpMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
  useGetAllUsersQuery,
  useUpdateUserProfileDataMutation,
} = userApi;
