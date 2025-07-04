import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contactAPI = createApi({
  reducerPath: "contactAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
    }),
    getContactMessages: builder.query({
      query: () => ({
        url: "/contact/admin/all",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSendContactMessageMutation,
  useGetContactMessagesQuery,
} = contactAPI;
