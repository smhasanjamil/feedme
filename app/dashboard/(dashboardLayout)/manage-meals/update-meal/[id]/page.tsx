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
  useGetMealByIdQuery,
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
import { CldUploadWidget, CldImage } from "next-cloudinary";

// Define the type for Cloudinary upload result
interface CloudinaryResult {
  event: string;
  info: {
    secure_url: string;
    [key: string]: unknown;
  };
}

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
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [mealData, setMealData] = useState<MealType | null>(null);

  const { data, error, isLoading } = useGetMealByIdQuery({ id });

  const [updateMeal, { isLoading: isUpdating }] = useUpdateMealMutation();

  useEffect(() => {
    if (data) {
      setMealData(data.data);
    }
  }, [data]);

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
              <Label>Meal Image</Label>
              {mealData?.image ? (
                <div className="flex flex-col items-center gap-4">
                  <CldImage
                    width="300"
                    height="200"
                    src={mealData.image}
                    alt="Uploaded meal"
                    className="rounded-lg object-cover"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setMealData((prev) =>
                          prev ? { ...prev, image: "" } : null,
                        )
                      }
                      type="button"
                    >
                      Change Image
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigator.clipboard.writeText(mealData.image)
                      }
                      type="button"
                    >
                      Copy URL
                    </Button>
                  </div>
                </div>
              ) : (
                <CldUploadWidget
                  uploadPreset="feedme"
                  onSuccess={(result) => {
                    const cloudinaryResult = result as CloudinaryResult;
                    if (
                      cloudinaryResult &&
                      cloudinaryResult.info &&
                      cloudinaryResult.info.secure_url
                    ) {
                      setMealData((prev) =>
                        prev
                          ? { ...prev, image: cloudinaryResult.info.secure_url }
                          : null,
                      );
                    }
                  }}
                  options={{
                    multiple: false,
                    sources: ["local"],
                    maxFiles: 1,
                    cropping: true,
                    croppingAspectRatio: 16 / 9,
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
                      modal: {
                        overflow: "visible",
                      },
                    },
                  }}
                >
                  {({ open }) => (
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
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, or WEBP (MAX. 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </CldUploadWidget>
              )}
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

            <div className="grid gap-2">
              <Label className="text-sm font-medium">AddOns</Label>
              <p className="text-muted-foreground -mt-1 mb-2 text-xs">
                Add add-ons with name and price (e.g., Extra Cheese - 2)
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
                  <div className="col-span-3 flex items-end">
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
