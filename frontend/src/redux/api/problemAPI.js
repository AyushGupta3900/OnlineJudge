import { baseApi } from './baseAPI.js';

const problemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProblems: builder.query({
      query: ({ page = 1, limit = 12, search = '', sortBy = 'createdAt', order = 'desc', difficulty, tag, status } = {}) => {
        const params = new URLSearchParams({ page, limit, search, sortBy, order });
        if (difficulty) params.set('difficulty', difficulty);
        if (tag) params.set('tag', tag);
        if (status) params.set('status', status);
        return `/problem/all?${params.toString()}`;
      },
      providesTags: ['Problem'],
    }),
    getProblemById: builder.query({
      query: (id) => `/problem/${id}`,
      providesTags: (result, error, id) => [{ type: 'Problem', id }],
    }),
    createProblem: builder.mutation({
      query: (newProblem) => ({
        url: '/problem/admin/new',
        method: 'POST',
        body: newProblem,
      }),
      invalidatesTags: ['Problem'],
    }),
    updateProblem: builder.mutation({
      query: ({ id, ...updatedFields }) => ({
        url: `/problem/admin/${id}`,
        method: 'PATCH',
        body: updatedFields,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Problem', id }, 'Problem'],
    }),
    deleteProblem: builder.mutation({
      query: (id) => ({
        url: `/problem/admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Problem', id }, 'Problem'],
    }),
    createProblemBatch: builder.mutation({
      query: (problemsArray) => ({
        url: '/problem/admin/batch-create',
        method: 'POST',
        body: problemsArray,
      }),
      invalidatesTags: ['Problem'],
    }),
    getProblemStatus: builder.query({
      query: (problemId) => `/problem/status/${problemId}`,
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
} = problemApi;
