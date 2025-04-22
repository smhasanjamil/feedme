import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["User", "Meal"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001",
    credentials: "include",
    prepareHeaders: (Headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        Headers.set("authorization", token);
      }
      return Headers;
    },
  }),
  endpoints: () => ({}),
});
