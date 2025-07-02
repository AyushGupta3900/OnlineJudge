import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_URL + '/submission';

export const submissionAPI = createApi({
  reducerPath: "submissionAPI",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    submitCode: builder.mutation({
      query: ({ problemId, code, language }) => ({
        url: "/submit",
        method: "POST",
        body: { problemId, code, language },
      }),
    }),
    getSubmissionById: builder.query({
      query: (submissionId) => `/${submissionId}`, 
    }),
    getSubmissionsByProblem: builder.query({
      query: (problemId) => `/user/${problemId}`, 
    }),
  }),
});

export const {
  useSubmitCodeMutation,
  useGetSubmissionByIdQuery,
  useLazyGetSubmissionByIdQuery,
  useGetSubmissionsByProblemQuery,
} = submissionAPI;
