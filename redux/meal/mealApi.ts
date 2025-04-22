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

    getMealByEmail: builder.query({
      query: (email: string) => ({
        url: `/providers/menu/provider-menus?email=${email}`,
        method: "GET",
      }),
      providesTags: ["Meal"],
    }),

    // 

    getSingleMeal: builder.query({
      query: ({ id }) => ({
        url: `/providers/menu/${id}`,
        method: "GET",
      }),
      providesTags: ['Meal'],
    }),

    createMeal: builder.mutation({
      query: (data) => ({
        url: "/providers/menu",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Meal"],
    }),

    updateMeal: builder.mutation({
      query: ({ mealId, data }) => ({
        url: `/providers/menu/${mealId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Meal"],
    }),

    deleteProduct: builder.mutation({
      query: (mealId) => ({
        url: `/providers/menu/${mealId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Meal"],
    }),
  }),
});

export const {
  useGetAllMealsQuery,
  useGetMealByEmailQuery,
  useGetSingleMealQuery,
  useCreateMealMutation,
  useUpdateMealMutation,
  useDeleteProductMutation,
} = mealApi;
