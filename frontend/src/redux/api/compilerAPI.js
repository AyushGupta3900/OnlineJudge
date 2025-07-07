import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const compilerAPI = createApi({
  reducerPath: "compilerAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_COMPILER_URL, 
    credentials: "include",
  }),
  endpoints: (builder) => ({
    runCode: builder.mutation({
      query: (body) => ({
        url: "/api/v1/run",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useRunCodeMutation } = compilerAPI;