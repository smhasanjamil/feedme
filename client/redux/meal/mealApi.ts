import { baseApi } from "@/redux/api/baseApi";

interface MealResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: any[];
}

interface MealIdParams {
  id: string;
}

const mealApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMeals: builder.query<MealResponse, any>({
      query: () => ({
        url: `/providers/menu`,
        method: "GET",
      }),
      transformResponse: (response: MealResponse) => {
        // Ensure response has the expected format
        if (!response || !response.data) {
          // Return a properly formatted response even if the API failed
          return {
            status: false,
            statusCode: 404,
            message: "No data received from server",
            data: [],
          };
        }
        return response;
      },
      // Handle errors at the query level
      transformErrorResponse: (error: any) => {
        console.error("Error fetching meals:", error);
        return error;
      },
      providesTags: ["Meal"],
    }),

    getMealByEmail: builder.query({
      query: (email: string) => ({
        url: `/providers/menu/provider-menus?email=${email}`,
        method: "GET",
      }),
      providesTags: ["Meal"],
    }),

    getMealById: builder.query({
      query: (params: MealIdParams) => {
        // Ensure id is not undefined before constructing the URL
        if (!params || !params.id) {
          console.error("getMealById: Missing ID parameter");
          return {
            url: `/providers/menu`,
            method: "GET",
          };
        }
        return {
          url: `/providers/menu/${params.id}`,
          method: "GET",
        };
      },
      providesTags: ["Meal"],
    }),

    createMeal: builder.mutation({
      query: (data) => ({
        url: "/providers/menu",
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (response) => {
        // Check if response is empty or undefined
        if (
          !response ||
          typeof response !== "object" ||
          Object.keys(response).length === 0
        ) {
          return { message: "Unknown error occurred. Please try again." };
        }

        // Log the error after checking it's valid
        console.error("Error creating meal:", response);

        // Return a structured error that will be easier to handle
        if (response.status === "FETCH_ERROR") {
          return { message: "Network error. Please check your connection." };
        }

        // Try to extract error message from response
        if (response.data) {
          return response.data;
        }

        return { message: "Failed to create meal. Please try again." };
      },
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
  useCreateMealMutation,
  useUpdateMealMutation,
  useDeleteProductMutation,
  useGetMealByIdQuery,
} = mealApi;
