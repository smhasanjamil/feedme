"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCreateMealMutation } from "@/redux/meal/mealApi";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { CldUploadWidget, CldImage } from "next-cloudinary";

interface AddOn {
  name: string;
  price: number;
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

interface Ratings {
  average: number;
  count: number;
  reviews: string[];
}

interface MealData {
  name: string;
  description: string;
  category: string;
  image: string;
  price: number;
  quantity: number;
  portionSize: string;
  preparationTime: number;
  isAvailable: boolean;
  ingredients: string[];
  customizationOptions: CustomizationOptions;
  nutritionalInfo: NutritionalInfo;
  ratings: Ratings;
}

export default function CreateMealForm() {
  const router = useRouter();
  const [createMeal, { isLoading }] = useCreateMealMutation();
  const initialMealData: MealData = {
    name: "",
    description: "",
    category: "Dinner",
    image: "",
    price: 0,
    quantity: 0,
    portionSize: "",
    preparationTime: 0,
    isAvailable: true,
    ingredients: [],
    customizationOptions: {
      removeIngredients: [],
      addOns: [],
      spiceLevel: [],
      noteToChef: true,
    },
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
    ratings: {
      average: 0,
      count: 0,
      reviews: [],
    },
  };
  const [mealData, setMealData] = useState<MealData>(initialMealData);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseFloat(value) : value;

    setMealData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleNestedChange = (
    section: keyof MealData,
    name: string,
    value: string | number | boolean | string[] | AddOn[],
  ) => {
    setMealData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as unknown as Record<string, unknown>),
        [name]: value,
      },
    }));
  };

  const handleArrayChange = (section: keyof MealData, value: string) => {
    setMealData((prev) => ({
      ...prev,
      [section]: value.split(",").map((v) => v.trim()),
    }));
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (document.body.style.overflow === "hidden") {
        document.body.style.overflow = "auto";
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(mealData);
    try {
      const result = await createMeal(mealData).unwrap();
      console.log("Meal created successfully", result);
      toast.success("Meal created successfully!");
      router.push("/dashboard/manage-meals");
      setMealData(initialMealData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Failed to create meal:", err.message);
        toast.error(err.message || "Failed to create meal.");
      } else {
        console.error("Failed to create meal:", err);
        if (
          typeof err === "object" &&
          err !== null &&
          "data" in err &&
          typeof err.data === "object" &&
          err.data !== null &&
          "message" in err.data
        ) {
          toast.error(`Failed to create meal. ${err.data.message}`);
        } else {
          toast.error("Failed to create meal.");
        }
      }
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Add Your New Meal</h1>
        <p className="mt-2 text-lg text-gray-600">
          Here you can add your new meal to the menu. Fill in the details below.
        </p>
      </div>
      <Card className="mx-auto mt-10 w-full max-w-4xl rounded-2xl border p-3 md:p-6">
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            {/* Basic Info */}
            <div className="grid gap-1">
              <Label htmlFor="name">Meal Name</Label>
              <Input
                name="name"
                id="name"
                placeholder="Meal Name"
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                name="description"
                id="description"
                placeholder="Description"
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-4 flex flex-col items-center gap-4">
                  {mealData?.image ? (
                    <div className="relative h-[200px] w-[200px]">
                      <CldImage
                        width={200}
                        height={200}
                        src={mealData.image}
                        alt="Meal image"
                        className="rounded-md object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative flex h-[200px] w-[200px] items-center justify-center rounded-md bg-gray-100">
                      <p className="text-gray-500">No image uploaded</p>
                    </div>
                  )}

                  <CldUploadWidget
                    options={{
                      maxFiles: 1,
                      resourceType: "image",
                      cloudName: "dciqyeuyp",
                    }}
                    onSuccess={(result, { widget }) => {
                      if (
                        result?.info &&
                        typeof result.info === "object" &&
                        "secure_url" in result.info
                      ) {
                        const secureUrl = result.info.secure_url as string;
                        setMealData((prev) => ({
                          ...prev,
                          image: secureUrl,
                        }));
                      }
                      widget.close();
                    }}
                    uploadPreset="feedme"
                  >
                    {({ open }) => (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => open()}
                      >
                        Upload Image
                      </Button>
                    )}
                  </CldUploadWidget>
                </div>
              </div>
            </div>

            <div className="grid gap-1">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) =>
                  setMealData((prev) => ({ ...prev, category: value }))
                }
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {["Breakfast", "Lunch", "Dinner"].map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label htmlFor="price">Price</Label>
                <Input
                  name="price"
                  id="price"
                  type="number"
                  placeholder="Price"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  name="quantity"
                  id="quantity"
                  type="number"
                  placeholder="Quantity"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label htmlFor="portionSize">Portion Size</Label>
                <Input
                  name="portionSize"
                  id="portionSize"
                  placeholder="e.g. 400g"
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="preparationTime">Preparation Time (min)</Label>
                <Input
                  name="preparationTime"
                  id="preparationTime"
                  type="number"
                  placeholder="Prep Time"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                name="isAvailable"
                checked={mealData.isAvailable}
                onCheckedChange={(val: boolean) =>
                  setMealData((prev) => ({ ...prev, isAvailable: val }))
                }
              />
              <Label htmlFor="isAvailable">Available</Label>
            </div>

            {/* Customization */}
            <div className="grid gap-1">
              <Label>Ingredients (comma separated)</Label>
              <Input
                placeholder="Ingredients"
                required
                onChange={(e) =>
                  handleArrayChange("ingredients", e.target.value)
                }
              />
            </div>

            <div className="grid gap-1">
              <Label>Remove Ingredients</Label>
              <Input
                placeholder="e.g. Onion, Garlic"
                onChange={(e) =>
                  handleNestedChange(
                    "customizationOptions",
                    "removeIngredients",
                    e.target.value.split(",").map((v) => v.trim()),
                  )
                }
              />
            </div>

            <div className="grid gap-1">
              <Label>Spice Levels</Label>
              <Input
                placeholder="e.g. Mild, Medium, Hot"
                onChange={(e) =>
                  handleNestedChange(
                    "customizationOptions",
                    "spiceLevel",
                    e.target.value.split(",").map((v) => v.trim()),
                  )
                }
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-sm font-medium">AddOns</Label>
              <p className="text-muted-foreground -mt-1 mb-2 text-xs">
                Add-ons allow extra customization. Add name and price for each.
              </p>

              {mealData.customizationOptions.addOns.map((addOn, index) => (
                <div key={index} className="grid grid-cols-12 items-end gap-2">
                  <div className="col-span-5">
                    <Label className="text-sm">Name</Label>
                    <Input
                      placeholder="e.g. Extra Cheese"
                      value={addOn.name}
                      onChange={(e) => {
                        const updated = [
                          ...mealData.customizationOptions.addOns,
                        ];
                        updated[index].name = e.target.value;
                        handleNestedChange(
                          "customizationOptions",
                          "addOns",
                          updated,
                        );
                      }}
                    />
                  </div>

                  <div className="col-span-4">
                    <Label className="text-sm">Price</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 2"
                      value={addOn.price}
                      onChange={(e) => {
                        const updated = [
                          ...mealData.customizationOptions.addOns,
                        ];
                        updated[index].price = parseFloat(e.target.value) || 0;
                        handleNestedChange(
                          "customizationOptions",
                          "addOns",
                          updated,
                        );
                      }}
                    />
                  </div>

                  <div className="col-span-3">
                    <Button
                      variant="destructive"
                      type="button"
                      className="w-full"
                      onClick={() => {
                        const updated =
                          mealData.customizationOptions.addOns.filter(
                            (_, i) => i !== index,
                          );
                        handleNestedChange(
                          "customizationOptions",
                          "addOns",
                          updated,
                        );
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const updated = [
                    ...mealData.customizationOptions.addOns,
                    { name: "", price: 0 },
                  ];
                  handleNestedChange("customizationOptions", "addOns", updated);
                }}
              >
                + Add AddOn
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={mealData.customizationOptions.noteToChef}
                onCheckedChange={(val: boolean) =>
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
                  required
                  type="number"
                  placeholder="Calories"
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
                  required
                  type="number"
                  placeholder="Protein"
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
                  required
                  type="number"
                  placeholder="Carbs"
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
                  required
                  type="number"
                  placeholder="Fat"
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

            <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Meal"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
