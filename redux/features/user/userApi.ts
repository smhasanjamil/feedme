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
  }),
});

export const { useGetAllUsersQuery } = userApi;
