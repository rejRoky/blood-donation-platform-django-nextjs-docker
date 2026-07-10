const { baseApi } = require("../api/baseApi");

const areaApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getDistrict: builder.query({
      query: () => ({
        url: "/districts/",
        method: "GET",
      }),
    }),
    getUpozilla: builder.query({
      query: (districtId) => ({
        url: `/districts/${districtId}/upazilas`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDistrictQuery, useGetUpozillaQuery } = areaApi;
