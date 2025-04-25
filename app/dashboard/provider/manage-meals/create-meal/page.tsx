/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [imageUrl, setImageUrl] = useState("");
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
    if (imageUrl) {
      setMealData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    }
  }, [imageUrl]);

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
    try {
      // Validate required fields before submitting
      if (!mealData.name || !mealData.description || !mealData.price) {
        toast.error("Please fill in all required fields");
        return;
      }

      const result = await createMeal(mealData).unwrap();
      console.log("Meal created successfully", result);
      toast.success("Meal created successfully!");
      router.push("/dashboard/manage-meals");
      setMealData(initialMealData);
    } catch (err: unknown) {
      console.error("Failed to create meal:", err);

      // Handle different error types
      if (err instanceof Error) {
        toast.error(err.message || "Failed to create meal");
      } else if (typeof err === "object" && err !== null) {
        // Handle RTK query error response
        if ("message" in err && typeof err.message === "string") {
          toast.error(err.message);
        } else if (
          "data" in err &&
          typeof err.data === "object" &&
          err.data &&
          "message" in err.data
        ) {
          const errorMessage =
            typeof err.data.message === "string"
              ? err.data.message
              : "Failed to create meal";
          toast.error(errorMessage);
        } else if (Object.keys(err).length === 0) {
          toast.error(
            "Failed to create meal. Please check your form inputs and try again.",
          );
        } else {
          toast.error("Failed to create meal. Server error occurred.");
        }
      } else {
        toast.error("Failed to create meal. Unknown error occurred.");
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

            <div className="grid gap-1">
              <Label>Meal Image</Label>
              {imageUrl ? (
                <div className="flex flex-col items-center gap-4">
                  <CldImage
                    width="300"
                    height="200"
                    src={imageUrl}
                    alt="Uploaded meal image"
                    className="rounded-lg object-cover"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setImageUrl("")}
                    type="button"
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <CldUploadWidget
                  uploadPreset="feedme"
                  onSuccess={(result: any) => {
                    if (result?.info?.secure_url) {
                      setImageUrl(result.info.secure_url);
                    }
                  }}
                  options={{
                    multiple: false,
                    sources: ["local"],
                    maxFiles: 1,
                    cropping: true,
                    croppingAspectRatio: 16 / 9,
                    showPoweredBy: false,
                    cloudName: "dciqyeuyp",
                    styles: {
                      palette: {
                        window: "#FFFFFF",
                        sourceBg: "#F4F4F5",
                        windowBorder: "#90A0B3",
                        tabIcon: "#000000",
                        inactiveTabIcon: "#555A5F",
                        menuIcons: "#555A5F",
                        link: "#000000",
                        action: "#000000",
                        inProgress: "#000000",
                        complete: "#000000",
                        error: "#FF0000",
                        textDark: "#000000",
                        textLight: "#FFFFFF",
                      },
                      frame: {
                        background: "#F4F4F5",
                      },
                      modal: {
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9999,
                        overflow: "visible",
                      },
                    },
                  }}
                >
                  {({ open }: { open: any }) => {
                    return (
                      <div
                        className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                        onClick={() => open()}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="mb-4 h-8 w-8 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, or WEBP (MAX. 5MB)
                          </p>
                        </div>
                      </div>
                    );
                  }}
                </CldUploadWidget>
              )}
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
