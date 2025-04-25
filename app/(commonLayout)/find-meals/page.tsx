"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllMealsQuery } from "@/redux/meal/mealApi";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  Search,
  ChefHat,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Define interface for meal object
interface Meal {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  providerId: string | { name?: string; _id?: string; email?: string };
  ratings?: { average: number; count: number };
  rating?: number;
  reviewCount?: number;
  preferences?: string[];
}

export default function FindMealsPage() {
  // const router = useRouter();
  const { data: mealData, isLoading, isError } = useGetAllMealsQuery({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [preferenceSearchTerm, setPreferenceSearchTerm] = useState("");
  const [providerSearchTerm, setProviderSearchTerm] = useState("");
  // New pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const mealsPerPage = 9;

  // Get all unique providers from the data
  const providers = mealData?.data
    ? Array.from(
        new Set(
          mealData.data.map((meal) =>
            typeof meal.providerId === "object" && meal.providerId?.name
              ? meal.providerId.name
              : typeof meal.providerId === "string"
                ? meal.providerId
                : "Unknown Provider",
          ),
        ),
      )
    : [];

  // Common meal preferences
  const preferences = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
    "Low-Carb",
    "Keto",
  ];

  // Filter preferences and providers based on search terms
  const filteredPreferences = preferences.filter((pref) =>
    pref.toLowerCase().includes(preferenceSearchTerm.toLowerCase()),
  );

  const filteredProviders = providers.filter((provider) =>
    provider.toLowerCase().includes(providerSearchTerm.toLowerCase()),
  );

  // Filter meals based on all criteria
  const filteredMeals =
    mealData?.data?.filter((meal) => {
      const matchesSearch =
        searchTerm === "" ||
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !selectedCategory || meal.category === selectedCategory;

      const rating = meal.ratings?.average ?? meal.rating ?? 0;
      const matchesRating = rating >= minRating;

      const providerName =
        typeof meal.providerId === "object" && meal.providerId?.name
          ? meal.providerId.name
          : typeof meal.providerId === "string"
            ? meal.providerId
            : "Unknown Provider";
      const matchesProvider =
        selectedProviders.length === 0 ||
        selectedProviders.includes(providerName);

      // This is mocked since we don't have preferences in the data model yet
      // In a real implementation, you would check meal.preferences or similar field
      const mealPreferences = meal.preferences || [];
      const matchesPreferences =
        selectedPreferences.length === 0 ||
        selectedPreferences.some(
          (pref) =>
            meal.description.toLowerCase().includes(pref.toLowerCase()) ||
            mealPreferences.includes(pref),
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesRating &&
        matchesProvider &&
        matchesPreferences
      );
    }) || [];

  // Pagination calculations
  const totalPages = Math.ceil(filteredMeals.length / mealsPerPage);
  const indexOfLastMeal = currentPage * mealsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - mealsPerPage;
  const currentMeals = filteredMeals.slice(indexOfFirstMeal, indexOfLastMeal);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCategory,
    minRating,
    selectedProviders,
    selectedPreferences,
  ]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // const handleMealSelect = (mealId: string) => {
  //   router.push(`/order/${mealId}`);
  // };

  const handleProviderToggle = (provider: string) => {
    setSelectedProviders((prev) =>
      prev.includes(provider)
        ? prev.filter((p) => p !== provider)
        : [...prev, provider],
    );
  };

  const handlePreferenceToggle = (preference: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((p) => p !== preference)
        : [...prev, preference],
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setMinRating(0);
    setSelectedProviders([]);
    setSelectedPreferences([]);
    setCurrentPage(1);
  };

  const renderRating = (meal: Meal) => {
    const rating = meal.ratings?.average ?? meal.rating ?? 0;
    const reviewCount = meal.ratings?.count ?? meal.reviewCount ?? 0;

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
            <div className="relative h-4 w-4">
              <Star className="absolute h-4 w-4 text-gray-300" />
              <Star
                className="absolute h-4 w-4 fill-yellow-400 text-yellow-400"
                style={{ clipPath: "inset(0 50% 0 0)" }}
              />
            </div>
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
          ))}
        </div>
        <span className="ml-1 text-sm text-gray-500">({reviewCount})</span>
      </div>
    );
  };

  // Pagination UI component
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];

    // Show at most 5 page numbers with current page in the middle when possible
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    // Adjust startPage if endPage is at the maximum
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="mt-8 flex items-center justify-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant={currentPage === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(1)}
              className="h-9 w-9"
            >
              1
            </Button>
            {startPage > 2 && <span className="mx-1">...</span>}
          </>
        )}

        {pageNumbers.map((number) => (
          <Button
            key={number}
            variant={currentPage === number ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(number)}
            className="h-9 w-9"
          >
            {number}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="mx-1">...</span>}
            <Button
              variant={currentPage === totalPages ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              className="h-9 w-9"
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="h-9 w-9"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Find Meals</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="mb-4 text-3xl font-bold">Error Loading Meals</h1>
        <p className="mb-6 text-gray-600">
          We are having trouble loading the available meals. Please try again
          later.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Find Meals</h1>

      {/* Search input */}
      <div className="relative mb-6">
        <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search meals by name or description..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Responsive Filtering Section */}
      <div className="mb-6 rounded-md border border-gray-200 bg-white p-4">
        {/* Section Title - Mobile Only */}
        <h3 className="mb-4 text-base font-semibold md:hidden">Filtering</h3>

        {/* Desktop View - Horizontal layout */}
        <div className="hidden md:flex md:flex-wrap md:items-center md:gap-0">
          {/* Section Title - Desktop */}
          <h3 className="mr-3 text-base font-semibold">Filtering</h3>

          {/* Category Pills */}
          <div className="mr-3 inline-flex items-center overflow-hidden rounded-md border">
            <Button
              variant={selectedCategory === null ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="rounded-none border-0"
            >
              All
            </Button>
            <Button
              variant={selectedCategory === "Breakfast" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory("Breakfast")}
              className="rounded-none border-0"
            >
              Breakfast
            </Button>
            <Button
              variant={selectedCategory === "Lunch" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory("Lunch")}
              className="rounded-none border-0"
            >
              Lunch
            </Button>
            <Button
              variant={selectedCategory === "Dinner" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory("Dinner")}
              className="rounded-none border-0"
            >
              Dinner
            </Button>
          </div>

          {/* Minimum Rating */}
          <div className="mr-3 flex items-center">
            <span className="mr-2 text-sm font-medium">Minimum Rating</span>
            <div className="relative flex w-[150px] items-center">
              <Slider
                value={[minRating]}
                min={0}
                max={5}
                step={1}
                onValueChange={(values) => setMinRating(values[0])}
                className="w-full"
              />
              <div className="absolute -top-3 right-0 left-0 flex justify-between">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <div
                    key={value}
                    className={`${minRating >= value ? "bg-black" : "bg-gray-200"}`}
                    style={{
                      height:
                        value === 0 || value === 5
                          ? "10px"
                          : value % 2 === 0
                            ? "8px"
                            : "6px",
                      width: value === 0 || value === 5 ? "2px" : "1px",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="ml-2 flex items-center gap-1">
              <span className="text-sm font-medium">{minRating}</span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>

          {/* Dietary Preferences Dropdown */}
          <div className="mr-3 flex items-center">
            <span className="mr-2 text-sm font-medium">
              Dietary Preferences
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex h-9 w-[130px] items-center gap-1 px-3"
                >
                  {selectedPreferences.length > 0
                    ? `${selectedPreferences.length} selected`
                    : "Select"}
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[240px]">
                <DropdownMenuLabel>Dietary Preferences</DropdownMenuLabel>
                <div className="px-2 py-1.5">
                  <div className="relative">
                    <Search className="absolute top-2.5 left-2 h-3.5 w-3.5 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Search preferences..."
                      className="h-8 pl-7 text-sm"
                      value={preferenceSearchTerm}
                      onChange={(e) => setPreferenceSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-[200px] overflow-auto">
                  {filteredPreferences.length > 0 ? (
                    filteredPreferences.map((preference) => (
                      <DropdownMenuCheckboxItem
                        key={preference}
                        checked={selectedPreferences.includes(preference)}
                        onCheckedChange={() =>
                          handlePreferenceToggle(preference)
                        }
                      >
                        {preference}
                      </DropdownMenuCheckboxItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-center text-sm text-gray-500">
                      No preferences found
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Meal Providers Dropdown */}
          <div className="mr-3 flex items-center">
            <span className="mr-2 text-sm font-medium">Meal Providers</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex h-9 w-[130px] items-center gap-1 px-3"
                >
                  {selectedProviders.length > 0
                    ? `${selectedProviders.length} selected`
                    : "Select"}
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[240px]">
                <DropdownMenuLabel>Meal Providers</DropdownMenuLabel>
                <div className="px-2 py-1.5">
                  <div className="relative">
                    <Search className="absolute top-2.5 left-2 h-3.5 w-3.5 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Search providers..."
                      className="h-8 pl-7 text-sm"
                      value={providerSearchTerm}
                      onChange={(e) => setProviderSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-[200px] overflow-auto">
                  {filteredProviders.length > 0 ? (
                    filteredProviders.map((provider) => (
                      <DropdownMenuCheckboxItem
                        key={provider}
                        checked={selectedProviders.includes(provider)}
                        onCheckedChange={() => handleProviderToggle(provider)}
                      >
                        {provider}
                      </DropdownMenuCheckboxItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-center text-sm text-gray-500">
                      No providers found
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Spacer */}
          <div className="flex-grow"></div>

          {/* Reset Button */}
          <Button
            variant="default"
            size="sm"
            onClick={resetFilters}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Reset
          </Button>
        </div>

        {/* Mobile View - Vertical layout */}
        <div className="flex flex-col space-y-4 md:hidden">
          {/* Category Pills */}
          <div className="w-full">
            <div className="inline-flex items-center overflow-hidden rounded-md border">
              <Button
                variant={selectedCategory === null ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="rounded-none border-0"
              >
                All
              </Button>
              <Button
                variant={selectedCategory === "Breakfast" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory("Breakfast")}
                className="rounded-none border-0"
              >
                Breakfast
              </Button>
              <Button
                variant={selectedCategory === "Lunch" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory("Lunch")}
                className="rounded-none border-0"
              >
                Lunch
              </Button>
              <Button
                variant={selectedCategory === "Dinner" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory("Dinner")}
                className="rounded-none border-0"
              >
                Dinner
              </Button>
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="flex w-full items-center justify-between">
            <span className="mr-8 text-sm font-medium">Minimum Rating</span>
            <div className="flex items-center gap-5">
              <div className="relative flex w-[180px] items-center">
                <Slider
                  value={[minRating]}
                  min={0}
                  max={5}
                  step={1}
                  onValueChange={(values) => setMinRating(values[0])}
                  className="w-full"
                />
                <div className="absolute -top-3 right-0 left-0 flex justify-between">
                  {[0, 1, 2, 3, 4, 5].map((value) => (
                    <div
                      key={value}
                      className={`${minRating >= value ? "bg-black" : "bg-gray-200"}`}
                      style={{
                        height:
                          value === 0 || value === 5
                            ? "10px"
                            : value % 2 === 0
                              ? "8px"
                              : "6px",
                        width: value === 0 || value === 5 ? "2px" : "1px",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{minRating}</span>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Dietary Preferences Dropdown */}
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-medium">Dietary Preferences</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex h-9 w-[180px] items-center gap-1 px-3"
                >
                  {selectedPreferences.length > 0
                    ? `${selectedPreferences.length} selected`
                    : "Select"}
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px]">
                <DropdownMenuLabel>Dietary Preferences</DropdownMenuLabel>
                <div className="px-2 py-1.5">
                  <div className="relative">
                    <Search className="absolute top-2.5 left-2 h-3.5 w-3.5 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Search preferences..."
                      className="h-8 pl-7 text-sm"
                      value={preferenceSearchTerm}
                      onChange={(e) => setPreferenceSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-[200px] overflow-auto">
                  {filteredPreferences.length > 0 ? (
                    filteredPreferences.map((preference) => (
                      <DropdownMenuCheckboxItem
                        key={preference}
                        checked={selectedPreferences.includes(preference)}
                        onCheckedChange={() =>
                          handlePreferenceToggle(preference)
                        }
                      >
                        {preference}
                      </DropdownMenuCheckboxItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-center text-sm text-gray-500">
                      No preferences found
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Meal Providers Dropdown */}
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-medium">Meal Providers</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex h-9 w-[180px] items-center gap-1 px-3"
                >
                  {selectedProviders.length > 0
                    ? `${selectedProviders.length} selected`
                    : "Select"}
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px]">
                <DropdownMenuLabel>Meal Providers</DropdownMenuLabel>
                <div className="px-2 py-1.5">
                  <div className="relative">
                    <Search className="absolute top-2.5 left-2 h-3.5 w-3.5 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Search providers..."
                      className="h-8 pl-7 text-sm"
                      value={providerSearchTerm}
                      onChange={(e) => setProviderSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-[200px] overflow-auto">
                  {filteredProviders.length > 0 ? (
                    filteredProviders.map((provider) => (
                      <DropdownMenuCheckboxItem
                        key={provider}
                        checked={selectedProviders.includes(provider)}
                        onCheckedChange={() => handleProviderToggle(provider)}
                      >
                        {provider}
                      </DropdownMenuCheckboxItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-center text-sm text-gray-500">
                      No providers found
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reset Button */}
          <div className="w-full">
            <Button
              variant="default"
              size="sm"
              onClick={resetFilters}
              className="bg-primary hover:bg-primary/90 float-right w-[180px] text-white"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          {filteredMeals.length} {filteredMeals.length === 1 ? "meal" : "meals"}{" "}
          found
          {filteredMeals.length > 0
            ? ` (showing ${indexOfFirstMeal + 1}-${Math.min(indexOfLastMeal, filteredMeals.length)} of ${filteredMeals.length})`
            : ""}
        </p>
      </div>

      {/* Meals grid */}
      {filteredMeals.length === 0 ? (
        <div className="py-12 text-center">
          <h2 className="mb-4 text-xl font-medium">No meals found</h2>
          <p className="mb-6 text-gray-500">
            Try adjusting your search or filters
          </p>
          <Button onClick={resetFilters}>Show All Meals</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentMeals.map((meal) => (
              <Link
                href={`/order/${meal._id}`}
                key={meal._id}
                className="hover:shadow-feed-jungle/20 cursor-pointer overflow-hidden rounded-2xl bg-white p-4 shadow-lg transition-shadow duration-300"
                // onClick={() => handleMealSelect(meal._id)}
              >
                <div className="relative aspect-video">
                  <Image
                    src={meal.image}
                    alt={meal.name}
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <Badge
                    className="bg-feed-lime absolute top-2 right-2 h-6 rounded-full text-base text-black"
                    variant="secondary"
                  >
                    {meal.category}
                  </Badge>
                </div>
                <div className="py-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="truncate text-lg font-semibold">
                      {meal.name}
                    </h3>
                    <span className="text-feed-jungle/70 text-lg font-semibold">
                      ৳{meal.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                    {meal.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <ChefHat className="h-4 w-4" />
                      <span>
                        {typeof meal.providerId === "object" &&
                        meal.providerId?.name
                          ? meal.providerId.name
                          : typeof meal.providerId === "string"
                            ? meal.providerId
                            : "Unknown Provider"}
                      </span>
                    </div>
                    {renderRating(meal)}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination controls */}
          {renderPagination()}
        </>
      )}
    </div>
  );
}
