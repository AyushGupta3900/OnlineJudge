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
      query: ({
        page = 1,
        limit = 12,
        search = '',
        sortBy = 'createdAt',
        order = 'desc',
        difficulty,
        tag,
        status,
      } = {}) => {
        const params = new URLSearchParams();

        params.set('page', page);
        params.set('limit', limit);
        params.set('search', search);
        params.set('sortBy', sortBy);
        params.set('order', order);

        if (difficulty) params.set('difficulty', difficulty);
        if (tag) params.set('tag', tag);
        if (status) params.set('status', status);

        return `/all?${params.toString()}`;
      },
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
    getProblemStatus: builder.query({
      query: (problemId) => `/status/${problemId}`,
      providesTags: (result, error, problemId) => [{ type: 'Problem', id: problemId }],
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
  useGetProblemStatusQuery,
} = problemAPI;
