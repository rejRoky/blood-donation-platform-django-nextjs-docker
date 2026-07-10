const { baseApi } = require("../api/baseApi");

const areaApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getDistrict: builder.query({
      query: () => ({
        url: "/area/district/",
        method: "GET",
      }),
    }),
    getUpozilla: builder.mutation({
      query: (districtId) => ({
        url: "/area/upazila/",
        method: "POST",
        body: { district_id: districtId },
      }),
    }),
  }),
});

export const { useGetDistrictQuery, useGetUpozillaMutation } = areaApi;
