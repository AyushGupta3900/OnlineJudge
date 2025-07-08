import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_URL + "/submission";

export const submissionAPI = createApi({
  reducerPath: "submissionAPI",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),
  tagTypes: ["Submission", "User","Problem"],
  endpoints: (builder) => ({
    submitCode: builder.mutation({
      query: ({ problemId, code, language }) => ({
        url: "/submit",
        method: "POST",
        body: { problemId, code, language },
      }),
      invalidatesTags: ["Submission", "User","Problem"], 
    }),
    getSubmissionById: builder.query({
      query: (submissionId) => `/${submissionId}`,
      providesTags: (result, error, id) => [{ type: "Submission", id }],
    }),
    getSubmissionsByProblem: builder.query({
      query: ({ problemId, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        return `/user/${problemId}?${params.toString()}`;
      },
      providesTags: ["Submission"],
    }),
  }),
});

export const {
  useSubmitCodeMutation,
  useGetSubmissionByIdQuery,
  useLazyGetSubmissionByIdQuery,
  useGetSubmissionsByProblemQuery,
} = submissionAPI;
