import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL + '/auth';

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include', // Sends cookies for auth
  }),
  tagTypes: ["User"], 
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signupUser: builder.mutation({
      query: (userData) => ({
        url: '/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ["User"],
    }),
    completeOnboarding: builder.mutation({
      query: (onboardingData) => ({
        url: '/onboarding',
        method: 'POST',
        body: onboardingData,
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
    getAllUsers: builder.query({
      query: () => ({
        url: '/admin/all',
        method: 'GET',
      }),
    }),
    makeUserAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/make/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ["User"],
    }),
    deleteUserAccount: builder.mutation({
      query: () => ({
        url: '/delete-account',
        method: 'DELETE',
      }),
      invalidatesTags: ["User"],
    }),
    updateUserAccount: builder.mutation({
      query: (updatedFields) => ({
        url: '/update-account',
        method: 'PATCH',
        body: updatedFields,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useSignupUserMutation,
  useLogoutUserMutation,
  useCompleteOnboardingMutation,
  useGetAuthUserQuery,
  useGetAllUsersQuery,
  useMakeUserAdminMutation,
  useDeleteUserAccountMutation,    
  useUpdateUserAccountMutation,  
} = authAPI;
