import { apiSlice } from "../api/apiSlice.js";
import { updateUser } from "../auth/authSlice.js";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/users/profile",
        method: "PATCH",
        body: formData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(updateUser(data.user));
      },
      invalidatesTags: ["User", "ReferrerProfile"],
    }),
    switchRoleMode: builder.mutation({
      query: (data) => ({
        url: "/users/role-mode",
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(updateUser(data.user));
      },
      invalidatesTags: ["User", "ReferrerProfile"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useSwitchRoleModeMutation,
} = userApi;
