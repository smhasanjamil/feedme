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

    updateUser: builder.mutation<
      //   DashboardUserData,
      //   { id: string; data: Partial<DashboardUserData> }
      // >({
      UpdateUserResponse, // ✅ Change this
      { id: string; data: Partial<DashboardUserData> }
    >({
      query: ({ id, data }) => ({
        url: `/user/admin-update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

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
} = userApi;
