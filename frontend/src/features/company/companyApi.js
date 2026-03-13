import { apiSlice } from "../api/apiSlice.js";

export const companyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchCompanies: builder.query({
      query: (q) => `/companies/search?q=${encodeURIComponent(q)}`,
    }),
    getCompanies: builder.query({
      query: () => "/companies",
      providesTags: ["Companies"],
    }),
    getCompanyById: builder.query({
      query: (id) => `/companies/${id}`,
    }),
    createCompany: builder.mutation({
      query: (data) => ({
        url: "/companies",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Companies"],
    }),
  }),
});

export const {
  useSearchCompaniesQuery,
  useGetCompaniesQuery,
  useGetCompanyByIdQuery,
  useCreateCompanyMutation,
} = companyApi;
