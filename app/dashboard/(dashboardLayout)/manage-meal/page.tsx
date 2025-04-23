"use client";
import { useGetAllMealsQuery } from "@/redux/meal/mealApi";
import FoodDetailsCard from "@/shared/FoodDetailsCard";
import React from "react";

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

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: meals = [], isError } = useGetAllMealsQuery({});
  console.log(meals);

  if (isError) return <p>Failed to fetch meals</p>;
  
  return (
    <FoodDetailsCard
      meals={meals.data}
      onEdit={(id) => console.log("Edit meal", id)}
      onDelete={(id) => console.log("Delete meal", id)}
    />
  );
};

export default page;
