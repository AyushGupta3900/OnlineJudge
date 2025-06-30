// src/redux/api/problemAPI.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const problemAPI = createApi({
  reducerPath: 'problemAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5005/api/v1/problem',
    credentials: 'include',
  }),
  tagTypes: ['Problem'],

  endpoints: (builder) => ({
    // GET /all
    getAllProblems: builder.query({
      query: () => '/all',
      providesTags: ['Problem'],
    }),

    // GET /:id
    getProblemById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Problem', id }],
    }),

    // POST /new
    createProblem: builder.mutation({
      query: (newProblem) => ({
        url: '/new',
        method: 'POST',
        body: newProblem,
      }),
      invalidatesTags: ['Problem'],
    }),

    // PATCH /:id
    updateProblem: builder.mutation({
      query: ({ id, ...updatedFields }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: updatedFields,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Problem', id },
        'Problem',
      ],
    }),
  }),
});

export const {
  useGetAllProblemsQuery,
  useGetProblemByIdQuery,
  useCreateProblemMutation,
  useUpdateProblemMutation,
} = problemAPI;
