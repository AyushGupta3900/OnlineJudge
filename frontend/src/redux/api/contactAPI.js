import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contactAPI = createApi({
  reducerPath: "contactAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  tagTypes: ["ContactMessage"],
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ContactMessage"],
    }),
    getContactMessages: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        sortBy = "createdAt",
        order = "desc",
      } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        params.set("search", search);
        params.set("sortBy", sortBy);
        params.set("order", order);

        return `/contact/admin/all?${params.toString()}`;
      },
      providesTags: ["ContactMessage"],
    }),
  }),
});

export const {
  useSendContactMessageMutation,
  useGetContactMessagesQuery,
} = contactAPI;
