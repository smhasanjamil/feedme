import { baseApi } from "@/redux/api/baseApi";

const mealApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMeals: builder.query({
      query: () => ({
        url: `/providers/menu`,
        method: "GET",
      }),
      providesTags: ["Meal"],
    }),
  }),
});

export const {useGetAllMealsQuery} = mealApi;
