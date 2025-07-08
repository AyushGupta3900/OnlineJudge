import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL + '/auth';

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
  }),
  tagTypes: ["User","Problem","Submission"],
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => ({
        url: '/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User','Problem','Submission'],
    }),
    signupUser: builder.mutation({
      query: (data) => ({
        url: '/signup',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ["User","Problem","Submission"],
    }),
    completeOnboarding: builder.mutation({
      query: (data) => ({
        url: '/onboarding',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getAuthUser: builder.query({
      query: () => ({
        url: '/me',
        method: 'GET',
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useSignupUserMutation,
  useLogoutUserMutation,
  useCompleteOnboardingMutation,
  useGetAuthUserQuery,
} = authAPI;
