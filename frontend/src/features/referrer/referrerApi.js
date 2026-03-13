import { apiSlice } from "../api/apiSlice.js";

export const referrerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReferrerProfile: builder.query({
      query: () => "/referrer/profile",
      providesTags: ["ReferrerProfile"],
    }),
    toggleAvailability: builder.mutation({
      query: () => ({ url: "/referrer/toggle-availability", method: "PATCH" }),
      invalidatesTags: ["ReferrerProfile", "Companies"],
    }),
    updatePrivacySettings: builder.mutation({
      query: (body) => ({ url: "/referrer/privacy", method: "PATCH", body }),
      invalidatesTags: ["ReferrerProfile"],
    }),
  }),
});

export const {
  useGetReferrerProfileQuery,
  useToggleAvailabilityMutation,
  useUpdatePrivacySettingsMutation,
} = referrerApi;
