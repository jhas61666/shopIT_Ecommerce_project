import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setLoading, setUser } from "../features/userSlice";

export const userApi = createApi({
  reducerPath: "userApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    credentials: "include",
  }),

  tagTypes: ["User", "AdminUsers"],

  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/me",
      transformResponse: (result) => result.user,

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
          dispatch(setIsAuthenticated(true));
          dispatch(setLoading(false));
        } catch (error) {
          // If the request fails (401), ensure we clear the persistent login flag
          localStorage.removeItem('isLoggedIn');
          dispatch(setLoading(false));
          console.log("Session expired or invalid");
        }
      },

      providesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/me/update",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
      // Manually update the Redux state with the new user data immediately
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Most backends return { success: true, user: { ... } }
          // If your backend returns the user directly, use: dispatch(setUser(data))
          if (data?.user) {
            dispatch(setUser(data.user));
          }
        } catch (error) {
          console.log("Update Profile failed:", error);
        }
      },
    }),

    uploadAvatar: builder.mutation({
      query: (body) => ({
        url: "/me/upload_avatar",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
      // Manually update the Redux state with the new avatar immediately
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(setUser(data.user));
          }
        } catch (error) {
          console.log("Avatar upload failed:", error);
        }
      },
    }),
    updatePassword: builder.mutation({
      query(body) {
        return {
          url: "/password/update",
          method: "PUT",
          body,
        }
      }
    }),
    forgotPassword: builder.mutation({
      query(body) {
        return {
          url: "/password/forgot",
          method: "POST",
          body,
        }
      }
    }),
    resetPassword: builder.mutation({
      query({ token, body }) {
        return {
          url: `/password/reset/${token}`,
          method: "PUT",
          body,
        }
      }
    }),
    getAdminUsers: builder.query({
      query: () => `/admin/users`,
      providesTags: ["AdminUsers"]
    }),

    getUserDetails: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: ["AdminUsers"], // Or use a specific tag like ["User"]
    }),

    updateUser: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/users/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["AdminUsers"],
    }),

    deleteUser: builder.mutation({
      query(id) {
        return {
          url: `/admin/users/${id}`,
          method: "DELETE",
        
        };
      },
      invalidatesTags: ["AdminUsers"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetAdminUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;