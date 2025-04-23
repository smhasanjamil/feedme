// redux/api/userApi.ts
import { DashboardUserData } from "@/components/userManagement/columns";
import { baseApi } from "@/redux/api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<DashboardUserData[], void>({
      query: () => ({
        url: "/user", 
        method: "GET",
      }),
      transformResponse: (response: { data: DashboardUserData[] }) => response.data,
      providesTags: ["User"],
    }),


    updateUser: builder.mutation<
      DashboardUserData, 
      { id: string; data: Partial<DashboardUserData> } 
    >({
      query: ({ id, data }) => ({
        url: `/user/update/${id}`,
        method: "PATCH", 
        body: data,
      }),
      invalidatesTags: ["User"],
    }),



  }),
});

export const { useGetAllUsersQuery, useUpdateUserMutation } = userApi;
