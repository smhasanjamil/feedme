"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { useGetMealByEmailQuery } from "@/redux/meal/mealApi";
import Image from "next/image";
import Link from "next/link";
import DeleteMealDialog from "@/components/DeleteMealDialog";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";

interface AddOn {
  name: string;
  price: number;
  _id: string;
}

interface CustomizationOptions {
  removeIngredients: string[];
  addOns: AddOn[];
  spiceLevel: string[];
  noteToChef: boolean;
}

interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface IMeal {
  _id: string;
  name: string;
  providerId: string;
  ingredients: string[];
  portionSize: string;
  price: number;
  image: string;
  category: string;
  description: string;
  preparationTime: number;
  isAvailable: boolean;
  customizationOptions: CustomizationOptions;
  nutritionalInfo: NutritionalInfo;
  ratings: {
    average: number;
    count: number;
    reviews: {
      userId: string;
      rating: number;
      comment: string;
      date: Date;
    }[];
  };
  quantity: number;
}

const MealsPage: React.FC = () => {
  const user = useAppSelector(currentUser);
  const {
    data: meals = [],
    isLoading,
    isError,
  } = useGetMealByEmailQuery(user?.email || "");

  if (isLoading) return <p>Loading meals...</p>;
  if (isError) return <p>Failed to fetch meals</p>;
  if (!meals || meals.data.length === 0)
    return (
      <div
        style={{ height: "calc(100vh - 56px)" }}
        className="flex flex-col items-center justify-center gap-4 p-3 text-center"
      >
        <Link href={"/dashboard/manage-meals/create-meal"}>
          <Button>Add New Meal</Button>
        </Link>
        <p className="text-xl font-medium">
          No meals found!!! please add your Available food menu.
        </p>
      </div>
    );

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Manage Your Meals</h1>
        <p className="mt-2 text-lg text-gray-600">
          Here you can view, edit, and update the meals you provide to
          customers.
        </p>
      </div>
      <div className="mr-4 mb-6 flex justify-end">
        <Link href={"/dashboard/manage-meals/create-meal"}>
          <Button>Add New Meal</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:p-4 lg:grid-cols-3">
        {meals.data.map((meal: IMeal) => (
          <Card key={meal._id} className="overflow-hidden border-gray-300">
            {meal.image && (
              <Image
                src={meal.image}
                alt="menu pictures"
                width={500}
                height={500}
              ></Image>
            )}

            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  {meal.name}
                </h3>
                <Badge variant="outline">{meal.category}</Badge>
              </div>

              <p className="line-clamp-2 text-sm text-gray-600">
                {meal.description}
              </p>

              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={star <= meal.ratings.average ? "yellow" : "white"}
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 17.25l-3.1 1.633c-.45.237-.983-.113-.913-.613l.58-3.392-2.47-2.406c-.39-.381-.18-.987.35-1.05l3.42-.497 1.524-3.09c.237-.481.904-.481 1.142 0l1.523 3.09 3.42.497c.53.063.74.669.35 1.05l-2.47 2.406.58 3.392c.07.5-.463.85-.913.613L12 17.25z"
                    />
                  </svg>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-x-2 text-sm text-gray-500">
                <p>
                  <strong>Price:</strong> ${meal.price.toFixed(2)}
                </p>
                <p>
                  <strong>Portion:</strong> {meal.portionSize}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {meal.isAvailable ? "✅ Available" : "❌ Unavailable"}
                </p>
                <p>
                  <strong>Prep Time:</strong> {meal.preparationTime} min
                </p>
              </div>

              {meal.nutritionalInfo && (
                <div className="border bg-gray-50 p-2 text-xs text-gray-700">
                  <strong className="mb-1 block">
                    Nutrition (per serving):
                  </strong>
                  <p>🍽 Calories: {meal.nutritionalInfo.calories} kcal</p>
                  <p>🥩 Protein: {meal.nutritionalInfo.protein}g</p>
                  <p>🍞 Carbs: {meal.nutritionalInfo.carbs}g</p>
                  <p>🧈 Fat: {meal.nutritionalInfo.fat}g</p>
                </div>
              )}

              {/* Customization Options */}
              {meal.customizationOptions && (
                <div className="space-y-1 border bg-gray-50 p-2 text-xs text-gray-700">
                  <strong className="mb-1 block">Customization:</strong>
                  {meal.customizationOptions.removeIngredients.length > 0 && (
                    <p>
                      🚫 Remove:{" "}
                      {meal.customizationOptions.removeIngredients.join(", ")}
                    </p>
                  )}
                  {meal.customizationOptions.addOns.length > 0 && (
                    <p>
                      ➕ Add-Ons:{" "}
                      {meal.customizationOptions.addOns
                        .map((addon) => `${addon.name} (+$${addon.price})`)
                        .join(", ")}
                    </p>
                  )}
                  {meal.customizationOptions.spiceLevel.length > 0 && (
                    <p>
                      🌶 Spice:{" "}
                      {meal.customizationOptions.spiceLevel.join(", ")}
                    </p>
                  )}
                  {meal.customizationOptions.noteToChef && (
                    <p>📝 Note to Chef: Enabled</p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Link href={`/dashboard/manage-meals/update-meal/${meal._id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Pencil size={14} /> Edit
                  </Button>
                </Link>
                <DeleteMealDialog meal={meal}></DeleteMealDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MealsPage;
