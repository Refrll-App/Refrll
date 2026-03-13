import { apiSlice } from "../api/apiSlice.js";

export const applicationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createApplication: builder.mutation({
      query: (data) => ({
        url: "/applications",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Applications"],
    }),
    getSeekerApplications: builder.query({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/applications/seeker?page=${page}&limit=${limit}`,
      providesTags: ["Applications"],
    }),
    getReferrerApplications: builder.query({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/applications/referrer?page=${page}&limit=${limit}`,
      providesTags: ["Applications"],
    }),
    updateApplicationStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/applications/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Applications"],
    }),
  }),
});

export const {
  useCreateApplicationMutation,
  useGetSeekerApplicationsQuery,
  useGetReferrerApplicationsQuery,
  useUpdateApplicationStatusMutation,
} = applicationApi;
