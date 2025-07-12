import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contestAPI = createApi({
  reducerPath: "contestAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllContests: builder.query({
      query: () => `/contest`,
    }),
    getContestById: builder.query({
      query: (contestId) => `/contest/${contestId}`,
    }),
    registerForContest: builder.mutation({
      query: (contestId) => ({
        url: `/contest/${contestId}/register`,
        method: "POST",
      }),
    }),
    getContestLeaderboard: builder.query({
      query: (contestId) => `/contest/${contestId}/leaderboard`,
    }),
    submitContestSolution: builder.mutation({
      query: ({ contestId, problemId, code, language }) => ({
        url: `/contest/${contestId}/submit/${problemId}`,
        method: "POST",
        body: { code, language },
      }),
    }),
  }),
});

export const {
  useGetAllContestsQuery,
  useGetContestByIdQuery,
  useRegisterForContestMutation,
  useGetContestLeaderboardQuery,
  useSubmitContestSolutionMutation,
} = contestAPI;