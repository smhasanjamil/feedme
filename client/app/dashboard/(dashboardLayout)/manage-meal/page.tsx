"use client";
import { useGetAllMealsQuery } from "@/redux/meal/mealApi";
import FoodDetailsCard from "@/shared/FoodDetailsCard";
import React, { useEffect } from "react";

// Define the Meal interface locally
interface Meal {
  _id: string;
  name: string;
  providerId: string;
  ingredients: string[];
  portionSize: string;
  price: number;
  image?: string;
  category: "Breakfast" | "Lunch" | "Dinner" | "Snack" | "Dessert";
  description: string;
  preparationTime: number;
  isAvailable: boolean;
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

const Page = () => {
  const { data: meals, isLoading, isError, error } = useGetAllMealsQuery({});

  // Debug log to check the API response structure

  useEffect(() => {
    if (meals) {
      console.log("Meals API Response:", meals);
      console.log("Meals data type:", typeof meals);
      console.log("Has data property:", meals.hasOwnProperty("data"));
      if (meals.data) {
        console.log("Data type:", typeof meals.data);
        console.log("Data is array:", Array.isArray(meals.data));
        console.log("Data length:", meals.data.length);
      }
    }
  }, [meals]);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading meals...</div>;
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="mb-4 text-red-500">
          Failed to fetch meals. Please try again later.
        </div>
        <div className="rounded bg-gray-100 p-4 text-sm">
          Error: {JSON.stringify(error, null, 2)}
        </div>
      </div>
    );
  }

  if (!meals || !meals.data) {
    // Using the mock data as fallback for demonstration

    const mockMeals: Meal[] = [
      {
        _id: "1",
        name: "Grilled Chicken Salad",
        providerId: "provider01",
        ingredients: [
          "Chicken Breast",
          "Lettuce",
          "Tomatoes",
          "Cucumber",
          "Olive Oil",
        ],
        portionSize: "Large",
        price: 10.99,
        image: "https://source.unsplash.com/featured/?chicken,salad",
        category: "Lunch",
        description: "A healthy salad with grilled chicken and fresh veggies.",
        preparationTime: 15,
        isAvailable: true,
        nutritionalInfo: {
          calories: 350,
          protein: 30,
          carbs: 12,
          fat: 15,
        },
      },
    ];

    return (
      <div>
        <div className="mb-4 rounded-md bg-yellow-100 p-4">
          <p className="text-yellow-700">
            Using sample data. API data not available.
          </p>
          <p className="mt-2 text-sm text-yellow-600">
            Response: {JSON.stringify(meals)}
          </p>
        </div>
        <FoodDetailsCard
          meals={mockMeals}
          onEdit={(id) => console.log("Edit meal", id)}
          onDelete={(id) => console.log("Delete meal", id)}
        />
      </div>
    );
  }

  return (
    <FoodDetailsCard
      meals={meals.data}
      onEdit={(id) => console.log("Edit meal", id)}
      onDelete={(id) => console.log("Delete meal", id)}
    />
  );
};

export default Page;
