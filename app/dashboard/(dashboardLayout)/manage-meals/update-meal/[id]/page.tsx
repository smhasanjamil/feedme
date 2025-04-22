"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetSingleMealQuery,
  useUpdateMealMutation,
} from "@/redux/meal/mealApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MealType = {
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  quantity: number;
  portionSize: string;
  preparationTime: number;
  isAvailable: boolean;
  ingredients: string[];
  customizationOptions: {
    removeIngredients: string[];
    spiceLevel: string[];
    addOns: { name: string; price: number }[];
    noteToChef: boolean;
  };
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

export default function EditMealPage() {
  const { id } = useParams();
  const router = useRouter();
  const [mealData, setMealData] = useState<MealType | null>(null);

  const { data, error, isLoading } = useGetSingleMealQuery({ id });

  const [updateMeal, { isLoading: isUpdating }] = useUpdateMealMutation();

  useEffect(() => {
    if (data) {
      setMealData(data.data);
    }
  }, [data]);

  if (isLoading || !mealData) return <p>Loading...</p>;
  if (error) return <p>Error loading meal.</p>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setMealData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      };
    });
  };

  const handleArrayChange = (key: keyof MealType, value: string) => {
    setMealData((prev) =>
      prev ? { ...prev, [key]: value.split(",").map((v) => v.trim()) } : prev,
    );
  };

  const handleNestedChange = (
    parentKey: keyof MealType,
    childKey: string,
    value: string | number | boolean | { name: string; price: number }[],
  ) => {
    setMealData((prev) =>
      prev
        ? {
            ...prev,
            [parentKey]: {
              ...(typeof prev[parentKey] === "object" &&
              prev[parentKey] !== null
                ? prev[parentKey]
                : {}),
              [childKey]: value,
            },
          }
        : prev,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealData) return;
    try {
      await updateMeal({ mealId: id, data: mealData }).unwrap();
      router.push("/dashboard/manage-meals");
      toast.success("Meal updated successfully!");
    } catch (err) {
      toast.error(`Failed to update meal. ${err}`);
    }
  };

  return (
    <main>
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Edit your Meal</h1>
        <p className="mt-2 text-lg text-gray-600">
          Here you can update your meal as per your requirements.
        </p>
      </div>
      <Card className="mx-auto mt-10 w-full max-w-4xl rounded-2xl border p-3 md:p-6">
        <CardContent className="md:p-6">
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-1">
              <Label htmlFor="name">Meal Name</Label>
              <Input
                name="name"
                value={mealData.name || ""}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                name="description"
                value={mealData.description || ""}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="image">Image</Label>
              <Input
                name="image"
                value={mealData.image || ""}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="category">Category</Label>
              <Select
                value={mealData.category}
                onValueChange={(value) =>
                  setMealData((prev) => ({ ...prev!, category: value }))
                }
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"].map(
                    (category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label>Price</Label>
                <Input
                  name="price"
                  type="number"
                  value={mealData.price?.toString() || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-1">
                <Label>Quantity</Label>
                <Input
                  name="quantity"
                  type="number"
                  value={mealData.quantity?.toString() || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label>Portion Size</Label>
                <Input
                  name="portionSize"
                  value={mealData.portionSize || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-1">
                <Label>Preparation Time</Label>
                <Input
                  name="preparationTime"
                  type="number"
                  value={mealData.preparationTime?.toString() || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={mealData.isAvailable}
                onCheckedChange={(val) =>
                  setMealData((prev) => ({ ...prev!, isAvailable: val }))
                }
              />
              <Label>Available</Label>
            </div>

            {/* Customization */}
            <div className="grid gap-1">
              <Label>Ingredients (comma separated)</Label>
              <Input
                placeholder="Ingredients"
                value={mealData.ingredients.join(", ")}
                onChange={(e) =>
                  handleArrayChange("ingredients", e.target.value)
                }
              />
            </div>

            <div className="grid gap-1">
              <Label>Remove Ingredients</Label>
              <Input
                placeholder="e.g. Onion, Garlic"
                value={mealData.customizationOptions.removeIngredients.join(
                  ", ",
                )}
                onChange={(e) =>
                  handleNestedChange(
                    "customizationOptions",
                    "removeIngredients",
                    e.target.value
                      .split(",")
                      .map((v) => ({ name: v.trim(), price: 0 })),
                  )
                }
              />
            </div>

            <div className="grid gap-1">
              <Label>Spice Levels</Label>
              <Input
                placeholder="e.g. Mild, Medium, Hot"
                value={mealData.customizationOptions.spiceLevel.join(", ")}
                onChange={(e) =>
                  handleNestedChange(
                    "customizationOptions",
                    "spiceLevel",
                    e.target.value
                      .split(",")
                      .map((v) => ({ name: v.trim(), price: 0 })),
                  )
                }
              />
            </div>

            <div className="grid gap-1">
              <Label>AddOns (format: name:price)</Label>
              <Input
                placeholder="e.g. Extra Cheese:2, Fries:3"
                value={mealData.customizationOptions.addOns
                  .map((addOn) => `${addOn.name}:${addOn.price}`)
                  .join(", ")}
                onChange={(e) => {
                  const addOns = e.target.value.split(",").map((entry) => {
                    const [name, price] = entry.split(":");
                    return { name: name.trim(), price: parseFloat(price) };
                  });
                  handleNestedChange("customizationOptions", "addOns", addOns);
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={mealData.customizationOptions.noteToChef}
                onCheckedChange={(val) =>
                  handleNestedChange("customizationOptions", "noteToChef", val)
                }
              />
              <Label>Allow Note to Chef</Label>
            </div>

            {/* Nutrition */}
            <h3 className="text-lg font-semibold">Nutritional Info</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label>Calories</Label>
                <Input
                  type="number"
                  value={mealData.nutritionalInfo.calories}
                  onChange={(e) =>
                    handleNestedChange(
                      "nutritionalInfo",
                      "calories",
                      parseInt(e.target.value),
                    )
                  }
                />
              </div>

              <div className="grid gap-1">
                <Label>Protein (g)</Label>
                <Input
                  type="number"
                  value={mealData.nutritionalInfo.protein}
                  onChange={(e) =>
                    handleNestedChange(
                      "nutritionalInfo",
                      "protein",
                      parseInt(e.target.value),
                    )
                  }
                />
              </div>

              <div className="grid gap-1">
                <Label>Carbs (g)</Label>
                <Input
                  type="number"
                  value={mealData.nutritionalInfo.carbs}
                  onChange={(e) =>
                    handleNestedChange(
                      "nutritionalInfo",
                      "carbs",
                      parseInt(e.target.value),
                    )
                  }
                />
              </div>

              <div className="grid gap-1">
                <Label>Fat (g)</Label>
                <Input
                  type="number"
                  value={mealData.nutritionalInfo.fat}
                  onChange={(e) =>
                    handleNestedChange(
                      "nutritionalInfo",
                      "fat",
                      parseInt(e.target.value),
                    )
                  }
                />
              </div>
            </div>

            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Meal"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
