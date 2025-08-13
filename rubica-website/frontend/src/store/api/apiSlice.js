import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Listing', 'Category', 'City'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    
    register: builder.mutation({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    getMe: builder.query({
      query: () => 'auth/me',
      providesTags: ['User'],
    }),
    
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: 'auth/updatedetails',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    logout: builder.mutation({
      query: () => ({
        url: 'auth/logout',
        method: 'GET',
      }),
      invalidatesTags: ['User'],
    }),

    // Categories endpoints
    getCategories: builder.query({
      query: (params = {}) => ({
        url: 'categories',
        params,
      }),
      providesTags: ['Category'],
    }),
    
    getCategoryTree: builder.query({
      query: () => 'categories/tree',
      providesTags: ['Category'],
    }),
    
    getCategory: builder.query({
      query: (id) => `categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
    
    getCategoryBySlug: builder.query({
      query: (slug) => `categories/slug/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Category', slug }],
    }),

    // Cities endpoints
    getCities: builder.query({
      query: (params = {}) => ({
        url: 'cities',
        params,
      }),
      providesTags: ['City'],
    }),
    
    getFeaturedCities: builder.query({
      query: (limit = 10) => ({
        url: 'cities/featured',
        params: { limit },
      }),
      providesTags: ['City'],
    }),
    
    getPopularCities: builder.query({
      query: (limit = 10) => ({
        url: 'cities/popular',
        params: { limit },
      }),
      providesTags: ['City'],
    }),
    
    getCity: builder.query({
      query: (id) => `cities/${id}`,
      providesTags: (result, error, id) => [{ type: 'City', id }],
    }),
    
    getCityBySlug: builder.query({
      query: (slug) => `cities/slug/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'City', slug }],
    }),

    // Listings endpoints
    getListings: builder.query({
      query: (params = {}) => ({
        url: 'listings',
        params,
      }),
      providesTags: ['Listing'],
    }),
    
    getFeaturedListings: builder.query({
      query: (params = {}) => ({
        url: 'listings/featured',
        params,
      }),
      providesTags: ['Listing'],
    }),
    
    getListing: builder.query({
      query: (id) => `listings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Listing', id }],
    }),
    
    getListingBySlug: builder.query({
      query: (slug) => `listings/slug/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Listing', slug }],
    }),
    
    createListing: builder.mutation({
      query: (listingData) => ({
        url: 'listings',
        method: 'POST',
        body: listingData,
      }),
      invalidatesTags: ['Listing'],
    }),
    
    updateListing: builder.mutation({
      query: ({ id, ...listingData }) => ({
        url: `listings/${id}`,
        method: 'PUT',
        body: listingData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Listing', id }],
    }),
    
    deleteListing: builder.mutation({
      query: (id) => ({
        url: `listings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Listing'],
    }),
    
    getUserListings: builder.query({
      query: (params = {}) => ({
        url: 'listings/user/me',
        params,
      }),
      providesTags: ['Listing'],
    }),
    
    updateListingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `listings/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Listing', id }],
    }),
    
    getContactInfo: builder.query({
      query: (id) => `listings/${id}/contact`,
    }),

    // User profile endpoints
    getUserProfile: builder.query({
      query: (username) => `users/profile/${username}`,
    }),
    
    getUserListings: builder.query({
      query: ({ username, params = {} }) => ({
        url: `users/profile/${username}/listings`,
        params,
      }),
    }),
  }),
});

export const {
  // Auth hooks
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
  
  // Categories hooks
  useGetCategoriesQuery,
  useGetCategoryTreeQuery,
  useGetCategoryQuery,
  useGetCategoryBySlugQuery,
  
  // Cities hooks
  useGetCitiesQuery,
  useGetFeaturedCitiesQuery,
  useGetPopularCitiesQuery,
  useGetCityQuery,
  useGetCityBySlugQuery,
  
  // Listings hooks
  useGetListingsQuery,
  useGetFeaturedListingsQuery,
  useGetListingQuery,
  useGetListingBySlugQuery,
  useCreateListingMutation,
  useUpdateListingMutation,
  useDeleteListingMutation,
  useGetUserListingsQuery,
  useUpdateListingStatusMutation,
  useGetContactInfoQuery,
  
  // User profile hooks
  useGetUserProfileQuery,
  useGetUserListingsQuery: useGetUserPublicListingsQuery,
} = apiSlice;