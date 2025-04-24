"use client";
import { useGetAllMealsQuery } from "@/redux/meal/mealApi";
import FoodDetailsCard from "@/shared/FoodDetailsCard";
import React, { useEffect } from "react";

// const meals = [
//   {
//     _id: "1",
//     name: "Grilled Chicken Salad",
//     providerId: "provider01",
//     ingredients: [
//       "Chicken Breast",
//       "Lettuce",
//       "Tomatoes",
//       "Cucumber",
//       "Olive Oil",
//     ],
//     portionSize: "Large",
//     price: 10.99,
//     image: "https://source.unsplash.com/featured/?chicken,salad",
//     category: "Lunch",
//     description: "A healthy salad with grilled chicken and fresh veggies.",
//     preparationTime: 15,
//     isAvailable: true,
//     nutritionalInfo: {
//       calories: 350,
//       protein: 30,
//       carbs: 12,
//       fat: 15,
//     },
//   },
//   {
//     _id: "2",
//     name: "Pancake Stack",
//     providerId: "provider02",
//     ingredients: ["Flour", "Milk", "Eggs", "Maple Syrup", "Butter"],
//     portionSize: "Medium",
//     price: 6.5,
//     image: "https://source.unsplash.com/featured/?pancakes,breakfast",
//     category: "Breakfast",
//     description: "Fluffy pancakes topped with rich maple syrup.",
//     preparationTime: 10,
//     isAvailable: true,
//     nutritionalInfo: {
//       calories: 500,
//       protein: 8,
//       carbs: 60,
//       fat: 20,
//     },
//   },
//   {
//     _id: "3",
//     name: "Beef Burger",
//     providerId: "provider03",
//     ingredients: ["Beef Patty", "Bun", "Cheese", "Lettuce", "Tomato", "Onion"],
//     portionSize: "Large",
//     price: 9.75,
//     image: "https://source.unsplash.com/featured/?burger",
//     category: "Dinner",
//     description: "Juicy beef burger with melted cheese and fresh toppings.",
//     preparationTime: 12,
//     isAvailable: false,
//     nutritionalInfo: {
//       calories: 700,
//       protein: 35,
//       carbs: 40,
//       fat: 35,
//     },
//   },
//   {
//     _id: "4",
//     name: "Chocolate Brownie",
//     providerId: "provider04",
//     ingredients: ["Chocolate", "Flour", "Sugar", "Eggs", "Butter"],
//     portionSize: "Small",
//     price: 3.25,
//     image: "https://source.unsplash.com/featured/?brownie,dessert",
//     category: "Dessert",
//     description: "Rich, fudgy chocolate brownie served warm.",
//     preparationTime: 8,
//     isAvailable: true,
//     nutritionalInfo: {
//       calories: 320,
//       protein: 4,
//       carbs: 40,
//       fat: 18,
//     },
//   },
//   {
//     _id: "5",
//     name: "Fruit Yogurt Parfait",
//     providerId: "provider05",
//     ingredients: ["Yogurt", "Granola", "Strawberries", "Blueberries", "Honey"],
//     portionSize: "Medium",
//     price: 4.5,
//     image: "https://source.unsplash.com/featured/?yogurt,fruit",
//     category: "Snack",
//     description: "Creamy yogurt layered with fruits and granola.",
//     preparationTime: 5,
//     isAvailable: true,
//     nutritionalInfo: {
//       calories: 250,
//       protein: 10,
//       carbs: 30,
//       fat: 8,
//     },
//   },
// ];

const Page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: meals, isLoading, isError, error } = useGetAllMealsQuery({});
  
  // Debug log to check the API response structure
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (meals) {
      console.log('Meals API Response:', meals);
      console.log('Meals data type:', typeof meals);
      console.log('Has data property:', meals.hasOwnProperty('data'));
      if (meals.data) {
        console.log('Data type:', typeof meals.data);
        console.log('Data is array:', Array.isArray(meals.data));
        console.log('Data length:', meals.data.length);
      }
    }
  }, [meals]);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading meals...</div>;
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="text-red-500 mb-4">Failed to fetch meals. Please try again later.</div>
        <div className="text-sm bg-gray-100 p-4 rounded">
          Error: {JSON.stringify(error, null, 2)}
        </div>
      </div>
    );
  }

  if (!meals || !meals.data) {
    // Using the mock data as fallback for demonstration
    const mockMeals = [
      {
        _id: "1",
        name: "Grilled Chicken Salad",
        providerId: "provider01",
        ingredients: ["Chicken Breast", "Lettuce", "Tomatoes", "Cucumber", "Olive Oil"],
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
      // Add more mock meals if needed
    ];
    
    return (
      <div>
        <div className="bg-yellow-100 p-4 mb-4 rounded-md">
          <p className="text-yellow-700">Using sample data. API data not available.</p>
          <p className="text-sm text-yellow-600 mt-2">Response: {JSON.stringify(meals)}</p>
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
