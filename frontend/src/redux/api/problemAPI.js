// src/redux/api/problemAPI.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL + '/problem';

export const problemAPI = createApi({
  reducerPath: 'problemAPI',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
  }),
  tagTypes: ['Problem'],

  endpoints: (builder) => ({
    getAllProblems: builder.query({
      query: () => '/all',
      providesTags: ['Problem'],
    }),
    getProblemById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Problem', id }],
    }),
    createProblem: builder.mutation({
      query: (newProblem) => ({
        url: '/admin/new',
        method: 'POST',
        body: newProblem,
      }),
      invalidatesTags: ['Problem'],
    }),
    updateProblem: builder.mutation({
      query: ({ id, ...updatedFields }) => ({
        url: `/admin/${id}`,
        method: 'PATCH',
        body: updatedFields,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Problem', id },
        'Problem',
      ],
    }),
    deleteProblem: builder.mutation({
      query: (id) => ({
        url: `/admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Problem', id },
        'Problem',
      ],
    }),
    createProblemBatch: builder.mutation({
      query: (problemsArray) => ({
        url: '/admin/batch-create',
        method: 'POST',
        body: problemsArray,
      }),
      invalidatesTags: ['Problem'],
    }),
  }),
});

export const {
  useGetAllProblemsQuery,
  useGetProblemByIdQuery,
  useCreateProblemMutation,
  useUpdateProblemMutation,
  useDeleteProblemMutation,
  useCreateProblemBatchMutation,
} = problemAPI;
