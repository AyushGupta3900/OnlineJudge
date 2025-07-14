import { baseApi } from './baseAPI.js';

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteAccount: builder.mutation({
      query: () => ({
        url: '/user/delete-account',
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Problem', 'Submission'],
    }),
    updateAccount: builder.mutation({
      query: (data) => ({
        url: '/user/update-account',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getLeaderboard: builder.query({
      query: ({ page = 1, limit = 10, search = '', sort = '-computedRating' } = {}) => {
        const params = new URLSearchParams({ page, limit, search, sort });
        return `/user/leaderboard?${params.toString()}`;
      },
      providesTags: ['User'],
    }),
    getProfileStats: builder.query({
      query: () => `/user/profile-stats`,
      providesTags: ['User'],
    }),
    getAllUserSubmissions: builder.query({
      query: ({ page = 1, limit = 10, verdict, language, sortBy = 'createdAt', order = 'desc' } = {}) => {
        const params = new URLSearchParams({ page, limit, sortBy, order });
        if (verdict) params.set('verdict', verdict);
        if (language) params.set('language', language);
        return `/user/all-submissions?${params.toString()}`;
      },
      providesTags: ['User'],
    }),
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10, search = '', sortBy = 'rating', order = 'desc' } = {}) => {
        const params = new URLSearchParams({ page, limit, search, sortBy, order });
        return `/user/admin/all?${params.toString()}`;
      },
      providesTags: ['User'],
    }),
    makeAdmin: builder.mutation({
      query: (id) => ({
        url: `/user/admin/make/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['User'],
    }),
    removeAdmin: builder.mutation({
      query: (id) => ({
        url: `/user/admin/remove/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useDeleteAccountMutation,
  useUpdateAccountMutation,
  useGetLeaderboardQuery,
  useGetProfileStatsQuery,
  useGetAllUserSubmissionsQuery,
  useGetAllUsersQuery,
  useMakeAdminMutation,
  useRemoveAdminMutation
} = userApi;
