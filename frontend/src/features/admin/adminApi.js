import { apiSlice } from "../api/apiSlice.js";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => "/admin/stats",
      providesTags: ["Admin"],
    }),
    getAdminUsers: builder.query({
      query: ({ page = 1, limit = 20, role = "", search = "" } = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (role) params.set("role", role);
        if (search) params.set("search", search);
        return `/admin/users?${params}`;
      },
      providesTags: ["Admin"],
    }),
    getAdminApplications: builder.query({
      query: ({ page = 1, limit = 20, status = "", companyId = "" } = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (status) params.set("status", status);
        if (companyId) params.set("companyId", companyId);
        return `/admin/applications?${params}`;
      },
      providesTags: ["Admin"],
    }),
    getLeaderboard: builder.query({
      query: ({ period = "month", companyId = "" } = {}) => {
        const params = new URLSearchParams({ period });
        if (companyId) params.set("companyId", companyId);
        return `/leaderboard?${params}`;
      },
      providesTags: ["Admin"],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetAdminUsersQuery,
  useGetAdminApplicationsQuery,
  useGetLeaderboardQuery,
} = adminApi;
