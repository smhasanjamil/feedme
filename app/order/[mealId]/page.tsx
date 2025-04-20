"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  provider: string;
  image: string;
}

export default function OrderPage({
  params,
}: {
  params: Promise<{ mealId: string }>;
}) {
  const router = useRouter();
  const { mealId } = use(params);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Mock meal data - in a real app, this would come from an API
  const mockMeals: Meal[] = [
    {
      id: "1",
      name: "Healthy Buddha Bowl",
      description: "Fresh vegetables with quinoa and tahini dressing",
      price: 12.99,
      rating: 4.5,
      provider: "Healthy Eats",
      image: "/meals/buddha-bowl.jpg",
    },
    {
      id: "2",
      name: "Grilled Salmon with Asparagus",
      description:
        "Fresh Atlantic salmon with roasted asparagus and lemon butter sauce",
      price: 18.99,
      rating: 4.8,
      provider: "Fresh Kitchen",
      image: "/meals/salmon.jpg",
    },
    {
      id: "3",
      name: "Vegetarian Pasta Primavera",
      description:
        "Al dente pasta with seasonal vegetables in a light cream sauce",
      price: 14.99,
      rating: 4.2,
      provider: "Home Cooks",
      image: "/meals/pasta.jpg",
    },
    {
      id: "4",
      name: "Beef Stir Fry",
      description:
        "Tender beef strips with mixed vegetables in a savory soy sauce",
      price: 16.99,
      rating: 4.6,
      provider: "Healthy Eats",
      image: "/meals/stir-fry.jpg",
    },
    {
      id: "5",
      name: "Mediterranean Platter",
      description:
        "Hummus, falafel, tabbouleh, and pita bread with tzatziki sauce",
      price: 15.99,
      rating: 4.7,
      provider: "Fresh Kitchen",
      image: "/meals/mediterranean.jpg",
    },
    {
      id: "6",
      name: "Chicken Caesar Salad",
      description:
        "Crisp romaine lettuce with grilled chicken, parmesan, and Caesar dressing",
      price: 13.99,
      rating: 4.3,
      provider: "Home Cooks",
      image: "/meals/caesar-salad.jpg",
    },
  ];

  useEffect(() => {
    const foundMeal = mockMeals.find((m) => m.id === mealId);
    if (foundMeal) {
      setMeal(foundMeal);
    } else {
      router.push("/find-meals");
    }
  }, [mealId, router]);

  const handleOptionToggle = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option],
    );
  };

  const calculateTotal = () => {
    if (!meal) return 0;
    let total = meal.price * quantity;

    if (selectedOptions.includes("extra-sauce")) total += 1.0 * quantity;
    if (selectedOptions.includes("extra-protein")) total += 3.0 * quantity;
    if (selectedOptions.includes("gluten-free")) total += 2.0 * quantity;

    return total.toFixed(2);
  };

  const handleOrder = () => {
    // TODO: Implement order submission
    console.log("Order submitted:", {
      mealId: meal?.id,
      quantity,
      specialInstructions,
      selectedOptions,
      total: calculateTotal(),
    });
    // Redirect to order confirmation page
    router.push("/order-confirmation");
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  if (!meal) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Customize Your Order</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <div className="relative aspect-video">
            <img
              src={meal.image}
              alt={meal.name}
              className="h-full w-full object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{meal.name}</span>
              <span className="text-lg font-semibold">${meal.price}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{meal.description}</p>
            <div className="mt-2 flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1">{meal.rating}</span>
              <span className="ml-2 text-sm text-gray-500">
                {meal.provider}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Customization Options</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="extra-sauce"
                  checked={selectedOptions.includes("extra-sauce")}
                  onCheckedChange={() => handleOptionToggle("extra-sauce")}
                />
                <Label htmlFor="extra-sauce">Extra Sauce (+$1.00)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="extra-protein"
                  checked={selectedOptions.includes("extra-protein")}
                  onCheckedChange={() => handleOptionToggle("extra-protein")}
                />
                <Label htmlFor="extra-protein">Extra Protein (+$3.00)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gluten-free"
                  checked={selectedOptions.includes("gluten-free")}
                  onCheckedChange={() => handleOptionToggle("gluten-free")}
                />
                <Label htmlFor="gluten-free">Gluten Free Option (+$2.00)</Label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="instructions">Special Instructions</Label>
            <Input
              id="instructions"
              placeholder="Any special requests?"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="space-y-4 pt-4">
            <div className="text-right text-xl font-semibold">
              Total: ${calculateTotal()}
            </div>
            <Button onClick={handleOrder} className="w-full">
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
