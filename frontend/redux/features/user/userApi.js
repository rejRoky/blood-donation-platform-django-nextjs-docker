const { baseApi } = require("../api/baseApi");

const userApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.append("page", params.page.toString());
        if (params.blood_group)
          searchParams.append("blood_group", params.blood_group);
        if (params.district_id)
          searchParams.append("district_id", params.district_id.toString());
        if (params.upazila_id)
          searchParams.append("upazila_id", params.upazila_id.toString());

        return {
          url: `/users/?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),

    registerUser: builder.mutation({
      query: (data) => ({
        url: "/register/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    loginUser: builder.mutation({
      query: (data) => ({
        url: "/login/",
        method: "POST",
        body: data,
      }),
    }),

    sendResetOtp: builder.mutation({
      query: (data) => ({
        url: "/send-reset-password-otp/",
        method: "POST",
        body: data,
      }),
    }),

    verifyResetOtp: builder.mutation({
      query: (data) => ({
        url: "/verify-reset-password-otp/",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/reset-password/",
        method: "POST",
        body: data,
      }),
    }),

    getLoginUser: builder.query({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateUserProfileData: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `/users/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["User"],
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
  useUpdateUserModeMutation,
  useUpdateUserProfileDataMutation,
} = userApi;
