import { apiSlice } from "../api/apiSlice.js";

export const leaderboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboard: builder.query({
      query: ({ period = "month", companyId = "" } = {}) =>
        `/leaderboard?period=${period}${companyId ? `&companyId=${companyId}` : ""}`,
    }),
  }),
});

export const { useGetLeaderboardQuery } = leaderboardApi;
