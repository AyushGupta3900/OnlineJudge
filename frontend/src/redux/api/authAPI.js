import { baseApi } from './baseAPI.js';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User', 'Problem', 'Submission'],
    }),
    signupUser: builder.mutation({
      query: (data) => ({
        url: '/auth/signup',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Problem', 'Submission'],
    }),
    completeOnboarding: builder.mutation({
      query: (data) => ({
        url: '/auth/onboarding',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getAuthUser: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useSignupUserMutation,
  useLogoutUserMutation,
  useCompleteOnboardingMutation,
  useGetAuthUserQuery,
} = authApi;
