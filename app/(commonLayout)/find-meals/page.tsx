"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllMealsQuery } from "@/redux/meal/mealApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Utensils,
  DollarSign,
  Search,
  Star,
  ChefHat,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Meal {
  _id: string;
  name: string;
  description: string;
  price: number;
  providerId:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };
  providerName?: string;
  ingredients: string[];
  portionSize: string;
  image: string;
  category: string;
  preparationTime: number;
  isAvailable: boolean;
  rating?: number;
  reviewCount?: number;
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  customizationOptions: {
    removeIngredients: string[];
    addOns: {
      name: string;
      price: number;
      _id: string;
    }[];
    spiceLevel: string[];
    noteToChef: boolean;
  };
}

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-2 h-4 w-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default function FindMealsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [minRating, setMinRating] = useState(0);

  const { data: mealsData, isLoading, isError } = useGetAllMealsQuery({});
  const meals = mealsData?.data || [];

  const providers = Array.from(
    new Set(
      meals.map((meal: Meal) => {
        if (typeof meal.providerName === "string") return meal.providerName;
        if (typeof meal.providerId === "object" && meal.providerId?.name)
          return meal.providerId.name;
        if (typeof meal.providerId === "string") return meal.providerId;
        return "Unknown Provider";
      }),
    ),
  ) as string[];

  const handleSearch = () => {
    let filteredMeals = [...meals];

    if (searchQuery) {
      filteredMeals = filteredMeals.filter(
        (meal: Meal) =>
          meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meal.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    if (selectedCategory && selectedCategory !== "all") {
      filteredMeals = filteredMeals.filter(
        (meal: Meal) => meal.category === selectedCategory,
      );
    }

    if (selectedPriceRange && selectedPriceRange !== "all") {
      const [min, max] = selectedPriceRange.split("-").map(Number);
      filteredMeals = filteredMeals.filter(
        (meal: Meal) => meal.price >= min && meal.price <= max,
      );
    }

    if (selectedSpiceLevel && selectedSpiceLevel !== "all") {
      filteredMeals = filteredMeals.filter((meal: Meal) =>
        meal.customizationOptions.spiceLevel.includes(selectedSpiceLevel),
      );
    }

    if (selectedProvider && selectedProvider !== "all") {
      filteredMeals = filteredMeals.filter((meal: Meal) => {
        const providerValue =
          typeof meal.providerName === "string"
            ? meal.providerName
            : typeof meal.providerId === "object" && meal.providerId.name
              ? meal.providerId.name
              : typeof meal.providerId === "string"
                ? meal.providerId
                : "Unknown Provider";
        return providerValue === selectedProvider;
      });
    }

    if (minRating > 0) {
      filteredMeals = filteredMeals.filter(
        (meal: Meal) => (meal.rating || 0) >= minRating,
      );
    }

    return filteredMeals;
  };

  const handleMealClick = (mealId: string) => {
    router.push(`/order/${mealId}`);
  };

  const filteredMeals = handleSearch();
  const categories: string[] = Array.from(
    new Set(meals.map((meal: Meal) => meal.category)),
  ) as string[];
  const spiceLevels = ["None", "Mild", "Spicy"];

  const renderRating = (rating: number = 0, reviewCount: number = 0) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        <div className="flex">
          {[...Array(fullStars)].map((_, i) => (
            <Star
              key={`full-${i}`}
              className="h-4 w-4 fill-yellow-400 text-yellow-400"
            />
          ))}
          {hasHalfStar && (
            <Star
              className="h-4 w-4 fill-yellow-400 text-yellow-400"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
          ))}
        </div>
        <span className="ml-1 text-sm text-gray-500">({reviewCount})</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Find Meals</h1>

      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search meals or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="min-w-[150px]">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category: string) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[150px]">
            <Select
              value={selectedPriceRange}
              onValueChange={setSelectedPriceRange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-10">Under $10</SelectItem>
                <SelectItem value="10-20">$10 - $20</SelectItem>
                <SelectItem value="20-30">$20 - $30</SelectItem>
                <SelectItem value="30-999">$30+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[180px]">
            <Select
              value={selectedProvider}
              onValueChange={setSelectedProvider}
            >
              <SelectTrigger>
                <SelectValue placeholder="Meal Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                {providers.map((provider: string) => (
                  <SelectItem key={provider} value={provider}>
                    {provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[150px]">
            <Select
              value={selectedSpiceLevel}
              onValueChange={setSelectedSpiceLevel}
            >
              <SelectTrigger>
                <SelectValue placeholder="Spice Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Spice Levels</SelectItem>
                {spiceLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[150px]">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium whitespace-nowrap">
                Min Rating: {minRating}
              </div>
              <Slider
                value={[minRating]}
                onValueChange={(value) => setMinRating(value[0])}
                max={5}
                step={0.5}
                className="w-24"
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedPriceRange("all");
              setSelectedSpiceLevel("all");
              setSelectedProvider("all");
              setMinRating(0);
            }}
            className="whitespace-nowrap"
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <div className="py-8 text-center">
          <p className="text-red-500">
            Error loading meals. Please try again later.
          </p>
        </div>
      ) : filteredMeals.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">
            No meals found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMeals.map((meal) => (
            <Card
              key={meal._id}
              className="cursor-pointer overflow-hidden border-2 transition-all duration-200 hover:border-red-500 hover:shadow-lg"
              onClick={() => handleMealClick(meal._id)}
            >
              <div className="relative aspect-video">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="h-full w-full object-cover"
                />
                <Badge
                  className="absolute top-2 right-2 bg-white text-black hover:bg-white"
                  variant="secondary"
                >
                  {meal.category}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-xl">{meal.name}</span>
                  <span className="text-lg font-semibold text-red-500">
                    ${meal.price}
                  </span>
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ChefHat className="h-4 w-4" />
                  <span>
                    {typeof meal.providerName === "string"
                      ? meal.providerName
                      : typeof meal.providerId === "object" &&
                          meal.providerId?.name
                        ? meal.providerId.name
                        : typeof meal.providerId === "string"
                          ? meal.providerId
                          : "Unknown Provider"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 line-clamp-2 text-gray-600">
                  {meal.description}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Utensils className="h-4 w-4" />
                    <span>{meal.portionSize}</span>
                    <span>•</span>
                    <Clock className="h-4 w-4" />
                    <span>{meal.preparationTime} mins</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="font-medium">
                      {meal.nutritionalInfo.calories} cal
                    </span>
                    <span>•</span>
                    <span className="font-medium">
                      {meal.nutritionalInfo.protein}g protein
                    </span>
                    <span>•</span>
                    <span className="font-medium">
                      {meal.nutritionalInfo.carbs}g carbs
                    </span>
                  </div>
                  {meal.rating !== undefined && (
                    <div className="mt-2">
                      {renderRating(meal.rating, meal.reviewCount || 0)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
