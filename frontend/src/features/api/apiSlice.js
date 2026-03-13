
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../auth/authSlice.js";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
};

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const url = typeof args === "string" ? args : args?.url;
  if (url === "/auth/refresh") return baseQuery(args, api, extraOptions);

  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status !== 401) return result;

  if (isRefreshing) {
    try {
      await new Promise((resolve, reject) => refreshQueue.push({ resolve, reject }));
      return baseQuery(args, api, extraOptions);
    } catch {
      api.dispatch(logout());
      return result;
    }
  }

  isRefreshing = true;
  try {
    const refreshResult = await baseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      api.dispatch(setCredentials(refreshResult.data));
      processQueue(null, refreshResult.data.accessToken);
      result = await baseQuery(args, api, extraOptions);
    } else {
      processQueue(new Error("Refresh failed"));
      api.dispatch(logout());
    }
  } catch (err) {
    processQueue(err);
    api.dispatch(logout());
  } finally {
    isRefreshing = false;
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Applications", "Companies", "ReferrerProfile", "Admin", "Notifications"],
  endpoints: () => ({}),
});
