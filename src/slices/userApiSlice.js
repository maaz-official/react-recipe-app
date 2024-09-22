import { USER_URL } from '../constant';
import { apiSlice } from './apiSlices';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login user
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),

    // Register new user
    register: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/register`,
        method: 'POST',
        body: data,
      }),
    }),

    // Logout user
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: 'POST',
      }),
    }),

    // Update user profile (for logged-in users)
    profile: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/profile`,
        method: 'PUT',
        body: data,
        // Check if the body is FormData, if so, remove default content-type header
        headers: data instanceof FormData ? undefined : { 'Content-Type': 'application/json' },
      }),
    }),


    // Get all users (admin)
    getUsers: builder.query({
      query: () => ({
        url: USER_URL,
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),

    // Get user by ID (admin)
    getUserById: builder.query({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Update user by ID (admin)
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${USER_URL}/${id}`, // API endpoint for updating a user by ID
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // Delete user by ID (admin)
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/${id}`, // API endpoint for deleting a user by ID
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useProfileMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,   // Query to get a single user by ID
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;
