// redux/api/userApi.ts
import { DashboardUserData } from "@/components/userManagement/columns";
import { baseApi } from "@/redux/api/baseApi";

type UpdateUserResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: DashboardUserData;
};



type DeleteUserResponse = {
  status: boolean;
  statusCode: number;
  message: string;
};

export type SingleUser = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: "admin" | "provider" | "customer";
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  password: string;
}


const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<DashboardUserData[], void>({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
      transformResponse: (response: { data: DashboardUserData[] }) =>
        response.data,
      providesTags: ["User"],
    }),

    getUserById: builder.query<SingleUser, string>({
      query: (id) => `user/${id}`,
      transformResponse: (response: { data: SingleUser }) => response.data,
    }),

    updateSingleUser: builder.mutation<UpdateUserResponse, Partial<SingleUser>>({
      query: (updatedUser) => ({
        url: `user/update/${updatedUser._id}`,  // Full endpoint with dynamic ID
        method: 'PATCH',
        body: updatedUser,
      }),
    }),

    // Dashboard user update
    updateUser: builder.mutation<
    
      UpdateUserResponse, 
      { id: string; data: Partial<DashboardUserData> }
    >({
      query: ({ id, data }) => ({
        url: `/user/admin-update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // New change password endpoint
    changePassword: builder.mutation<
      { status: boolean; statusCode: number; message: string },
      { userId: string; currentPassword: string; newPassword: string }
    >({
      query: ({ userId, currentPassword, newPassword }) => ({
        url: `/user/change-password/${userId}`,
        method: "PATCH",
        body: { currentPassword, newPassword },
      }),
    }),

    // Delete user
    deleteUser: builder.mutation<
      DeleteUserResponse,
      string // the user ID
    >({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useUpdateSingleUserMutation,
  useChangePasswordMutation
} = userApi;
