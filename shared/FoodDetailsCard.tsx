import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

interface NutritionalInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

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
  nutritionalInfo?: NutritionalInfo;
}

interface Props {
  meals: Meal[];
  onEdit: (mealId: string) => void;
  onDelete: (mealId: string) => void;
}

const FoodDetailsCard: React.FC<Props> = ({ meals, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {meals.map((meal) => (
        <Card key={meal._id} className="overflow-hidden">
          {meal.image && (
            <img
              src={meal.image}
              alt={meal.name}
              className="w-full object-cover"
            />
          )}
          <CardContent className="space-y-2 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">{meal.name}</h3>
              <Badge variant="outline">{meal.category}</Badge>
            </div>

            <p className="line-clamp-2 text-sm text-gray-600">
              {meal.description}
            </p>

            <div className="space-y-1 text-sm text-gray-500">
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

            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                // onClick={() => onEdit(meal._id)}
                className="flex items-center gap-1"
              >
                <Pencil size={14} /> Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                // onClick={() => onDelete(meal._id)}
                className="flex items-center gap-1"
              >
                <Trash2 size={14} /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FoodDetailsCard;
