import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

// Define a fallback API URL in case environment variable is not set
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["User", "Meal"],
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
    prepareHeaders: (Headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        Headers.set("authorization", token);
      }
      return Headers;
    },
    // Add additional configuration for handling fetch errors
    fetchFn: async (...args) => {
      try {
        const response = await fetch(...args);
        return response;
      } catch (error) {
        console.error("Network error in API call:", error);
        // Re-throw to let RTK Query's error handling take over
        throw error;
      }
    }
  }),
  endpoints: () => ({}),
});
