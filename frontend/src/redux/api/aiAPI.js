import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aiAPI = createApi({
  reducerPath: "aiAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  tagTypes: ["AIReview", "Boilerplate", "TestCases", "AIHint"],

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
      query: (payload) => ({
        url: "/ai/generate-testcases",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["TestCases"],
    }),

    generateAiHint: builder.mutation({
      query: (payload) => ({
        url: "/ai/generate-ai-hint",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AIHint"],
    }),
  }),
});

export const {
  useGetAIReviewMutation,
  useGenerateBoilerplateMutation,
  useGenerateTestCasesMutation,
  useGenerateAiHintMutation,
} = aiAPI;
