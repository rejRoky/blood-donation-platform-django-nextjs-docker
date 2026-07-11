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
    getUpozilla: builder.query({
      query: (districtId) => ({
        url: `/area/upazila/?district_id=${districtId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDistrictQuery, useGetUpozillaQuery } = areaApi;
