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
    getMealById: builder.query({
      query: (id) => ({
        url: `/providers/menu/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Meal", id }],
    }),
  }),
});

export const { useGetAllMealsQuery, useGetMealByIdQuery } = mealApi;
