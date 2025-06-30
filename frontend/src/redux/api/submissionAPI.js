import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const submissionAPI = createApi({
  reducerPath: "submissionAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_COMPILER_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    runCode: builder.mutation({
      query: (body) => ({
        url: "/run",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useRunCodeMutation } = submissionAPI;