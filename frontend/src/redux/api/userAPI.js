import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_URL + "/user";

export const userAPI = createApi({
  reducerPath: "userAPI",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    deleteAccount: builder.mutation({
      query: () => ({
        url: `/delete-account`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateAccount: builder.mutation({
      query: (data) => ({
        url: `/update-account`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getLeaderboard: builder.query({
      query: ({ page = 1, limit = 10, search = "", sort = "-rating" } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        params.set("search", search);
        params.set("sort", sort);
        return `/leaderboard?${params.toString()}`;
      },
      providesTags: ["User"],
    }),
    getProfileStats: builder.query({
      query: () => `/profile-stats`,
      providesTags: ["User"],
    }),
    getAllUserSubmissions: builder.query({
      query: ({
        page = 1,
        limit = 10,
        verdict,
        language,
        sortBy = "submittedAt",
        order = "desc",
      } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        params.set("sortBy", sortBy);
        params.set("order", order);
        if (verdict) params.set("verdict", verdict);
        if (language) params.set("language", language);
        return `/all-submissions?${params.toString()}`;
      },
      providesTags: ["User"],
    }),
    getAllUsers: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        sortBy = "rating",
        order = "desc",
      } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        params.set("search", search);
        params.set("sortBy", sortBy);
        params.set("order", order);
        return `/admin/all?${params.toString()}`;
      },
      providesTags: ["User"],
    }),
    makeAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/make/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useDeleteAccountMutation,
  useUpdateAccountMutation,
  useGetLeaderboardQuery,
  useGetProfileStatsQuery,
  useGetAllUserSubmissionsQuery,
  useGetAllUsersQuery,
  useMakeAdminMutation,
} = userAPI;
