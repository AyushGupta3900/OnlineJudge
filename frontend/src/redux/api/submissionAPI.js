import { baseApi } from './baseAPI.js';

const submissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitCode: builder.mutation({
      query: ({ problemId, code, language }) => ({
        url: '/submission/submit',
        method: 'POST',
        body: { problemId, code, language },
      }),
      invalidatesTags: ['Submission', 'User', 'Problem'],
    }),
    getSubmissionById: builder.query({
      query: (submissionId) => `/submission/${submissionId}`,
      providesTags: (result, error, id) => [{ type: 'Submission', id }],
      keepUnusedDataFor: 0,
    }),
    getSubmissionsByProblem: builder.query({
      query: ({ problemId, page = 1, limit = 10, language, verdict }) => {
        const params = new URLSearchParams({ page, limit, language, verdict });
        return `/submission/user/${problemId}?${params.toString()}`;
      },
      providesTags: ['Submission'],
    }),
  }),
});

export const {
  useSubmitCodeMutation,
  useGetSubmissionByIdQuery,
  useLazyGetSubmissionByIdQuery,
  useGetSubmissionsByProblemQuery,
} = submissionApi;