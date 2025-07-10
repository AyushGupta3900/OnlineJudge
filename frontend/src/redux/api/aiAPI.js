import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aiAPI = createApi({
  reducerPath: "aiAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  tagTypes: ["AIReview", "Boilerplate", "TestCases"],

  endpoints: (builder) => ({
    getAIReview: builder.mutation({
      query: ({ code, language, problemId }) => ({
        url: "/ai/review",
        method: "POST",
        body: { code, language, problemId },
      }),
      invalidatesTags: ["AIReview"],
    }),

    generateBoilerplate: builder.mutation({
      query: ({ language, problemId }) => ({
        url: "/ai/generate-boilerplate",
        method: "POST",
        body: { language, problemId },
      }),
      invalidatesTags: ["Boilerplate"],
    }),

    generateTestCases: builder.mutation({
      query: ({ problemId }) => ({
        url: "/ai/generate-testcases",
        method: "POST",
        body: { problemId },
      }),
      invalidatesTags: ["TestCases"],
    }),
  }),
});

export const {
  useGetAIReviewMutation,
  useGenerateBoilerplateMutation,
  useGenerateTestCasesMutation,
} = aiAPI;
