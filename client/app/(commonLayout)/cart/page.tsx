/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingBag, MinusCircle, PlusCircle } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useGetMealByIdQuery } from "@/redux/meal/mealApi";
import { getMealImageUrl } from "../order/[mealId]/addToCartUtils";
import { useRemoveFromCart } from "@/app/hooks/useRemoveFromCart";

// Server-safe date formatter helper
const formatDate = (dateString: string) => {
  try {
    // Ensure consistent date formatting between server and client
    const date = new Date(dateString);
    // Use explicit formatting that doesn't depend on locale
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    // Return original string if parsing fails
    return dateString;
  }
};

// Define appropriate types for cart items
interface CartItemType {
  _id: string;
  mealId: string;
  mealName: string;
  providerName: string;
  price: number;
  quantity: number;
  deliveryDate: string;
  deliverySlot: string;
  imageUrl?: string;
  customization?: {
    spiceLevel?: string;
    removedIngredients?: string[];
    specialInstructions?: string;
    addOns?: Array<{
      _id?: string;
      name: string;
      price: number;
    }>;
  };
}

interface CartItemProps {
  item: CartItemType;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

const CartItem = ({ item, removeItem, updateQuantity }: CartItemProps) => {
  // Fetch meal details to get the image if it's not in the cart item
  const { data: mealData } = useGetMealByIdQuery(
    { id: item.mealId },
    {
      skip: !item.mealId,
    },
  );

  // Display the item ID for debugging purposes
  console.log(`Item ID for ${item.mealName}:`, item.mealId);

  // Use the utility function to get the image URL
  const imageUrl =
    getMealImageUrl(item) ||
    (mealData?.data ? getMealImageUrl(mealData.data) : null);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(item._id, newQuantity);
    }
  };

  const handleRemoveItem = async () => {
    if (!item.mealId) {
      console.error("Cannot remove item: Missing meal ID");
      return;
    }

    // Log the item ID we're removing
    console.log("Removing item with ID:", item.mealId);

    // Use the hook's removeItem function
    try {
      await removeItem(item.mealId);
      console.log("Item removal process completed");
    } catch (error) {
      console.error("Error during item removal:", error);
    }
  };

  return (
    <Card
      key={item._id}
      className="mb-4 w-full border-none shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <CardContent className="p-4">
        {/* Display the item ID for debugging */}
        <div className="mb-2 text-xs text-gray-400">ID: {item._id}</div>

        <div className="flex flex-col gap-6 md:flex-row">
          <div className="relative h-32 w-full overflow-hidden rounded-lg bg-gray-100 md:w-32">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={item.mealName}
                className="h-full w-full object-cover"
              />
            ) : (
              /* Placeholder when no image available */
              <div className="flex h-full items-center justify-center text-gray-400">
                <ShoppingBag className="h-8 w-8" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800">{item.mealName}</h3>
            <p className="mt-1 text-sm text-gray-600">
              Provider: <span className="font-medium">{item.providerName}</span>
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Delivery:{" "}
              <span className="font-medium">
                {formatDate(item.deliveryDate)} ({item.deliverySlot})
              </span>
            </p>

            {item.customization && (
              <div className="mt-3 rounded-lg bg-gray-50 p-2">
                {item.customization.spiceLevel && (
                  <p className="text-xs text-gray-700">
                    <span className="font-medium">Spice Level:</span>{" "}
                    {item.customization.spiceLevel}
                  </p>
                )}

                {item.customization.removedIngredients &&
                  item.customization.removedIngredients.length > 0 && (
                    <p className="text-xs text-gray-700">
                      <span className="font-medium">Removed:</span>{" "}
                      {item.customization.removedIngredients.join(", ")}
                    </p>
                  )}

                {item.customization.specialInstructions && (
                  <p className="text-xs text-gray-700">
                    <span className="font-medium">Special Instructions:</span>{" "}
                    {item.customization.specialInstructions}
                  </p>
                )}
              </div>
            )}

            {item.customization?.addOns &&
              item.customization.addOns.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-700">Add-ons:</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {item.customization.addOns.map((addon, index) => (
                      <span
                        key={addon._id || index}
                        className="rounded-full bg-gray-100 px-2 py-1 text-xs"
                      >
                        {addon.name} (+৳{addon.price.toFixed(2)})
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>

          <div className="flex flex-col items-end justify-between">
            <p className="text-lg font-bold text-gray-800">
              ৳{(item.price * item.quantity).toFixed(2)}
            </p>

            <div className="mt-3 flex items-center rounded-full bg-gray-100 p-1">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="p-1 text-gray-500 transition-colors hover:text-red-500"
                disabled={item.quantity <= 1}
              >
                <MinusCircle className="h-5 w-5" />
              </button>
              <span className="mx-3 w-6 text-center font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="p-1 text-gray-500 transition-colors hover:text-green-500"
              >
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="mt-3 h-8 px-2 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={handleRemoveItem}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CartPage = () => {
  const router = useRouter();
  const user = useAppSelector(currentUser);
  const { cart, totalAmount, isLoading, error, updateQuantity } = useCart();
  const { removeItem, isLoading: isRemoving } = useRemoveFromCart();
  // Add client-side only state
  const [mounted, setMounted] = React.useState(false);

  // If user is not logged in, redirect to login
  React.useEffect(() => {
    if (!user) {
      router.push("/login");
    }
    setMounted(true);
  }, [user, router]);

  const handleCheckout = () => {
    if (cart?.length > 0) {
      const firstItem = cart[0];
      // Use window.location.href for immediate navigation without showing empty cart
      window.location.href = `/checkout/${firstItem.mealId}`;
    } else {
      // Use window.location.href for direct navigation without router transition
      window.location.href = "/checkout";
    }
  };

  const handleContinueShopping = () => {
    router.push("/find-meals");
  };

  // Render a common empty skeleton first for both server and client
  if (!mounted) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">Your Cart</h1>
        <div className="grid grid-cols-1 gap-4">
          <Card className="w-full">
            <CardContent>
              <div className="text-center">
                <div className="mb-4 h-6 w-full"></div>
                <div className="h-10 w-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Now handle client-side only rendering
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">Your Cart</h1>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="mb-4 w-full border-none shadow-sm">
              <CardContent>
                <div className="flex items-center">
                  <div className="bg-accent mr-6 h-24 w-24 animate-pulse rounded-lg"></div>
                  <div className="flex-1">
                    <div className="bg-accent mb-2 h-6 w-3/4 animate-pulse rounded-md"></div>
                    <div className="bg-accent mb-2 h-4 w-1/2 animate-pulse rounded-md"></div>
                    <div className="bg-accent h-4 w-1/3 animate-pulse rounded-md"></div>
                  </div>
                  <div className="bg-accent h-8 w-20 animate-pulse rounded-md"></div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2"></div>
            <div className="lg:col-span-1">
              <Card className="w-full border-none shadow-sm">
                <CardContent>
                  <div className="space-y-4 py-4">
                    <div className="bg-accent h-6 w-1/2 animate-pulse rounded-md"></div>
                    <div className="bg-accent h-4 w-full animate-pulse rounded-md"></div>
                    <div className="bg-accent h-4 w-full animate-pulse rounded-md"></div>
                    <div className="bg-accent h-6 w-3/4 animate-pulse rounded-md"></div>
                    <div className="bg-accent h-10 w-full animate-pulse rounded-md"></div>
                    <div className="bg-accent h-10 w-full animate-pulse rounded-md"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">Your Cart</h1>
        <div className="grid grid-cols-1 gap-4">
          <Card className="w-full border-none shadow-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="relative mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
                <Button
                  onClick={handleContinueShopping}
                  className="mt-2 bg-red-500 hover:bg-red-600"
                >
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-800"></h1>
        <div className="grid grid-cols-1 gap-4">
          <Card className="w-full border-none shadow-sm">
            <CardContent className="p-10">
              <div className="text-center">
                <div className="mb-6">
                  <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
                </div>
                <h2 className="mb-3 text-2xl font-bold text-gray-800">
                  Your Cart is Empty
                </h2>
                <p className="mx-auto mb-8 max-w-md text-gray-500">
                  Looks like you haven&apos;t added any meals to your cart yet.
                  Browse our delicious menu and add items to your cart!
                </p>
                <div className="mx-auto max-w-xs">
                  <Button
                    onClick={handleContinueShopping}
                    className="h-12 w-full rounded-full bg-red-500 hover:bg-red-600"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Browse Meals
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">Your Cart</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {cart.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              removeItem={removeItem}
              updateQuantity={updateQuantity}
            />
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <Card className="w-full border-none shadow-sm">
              <CardHeader className="border-b pb-2">
                <CardTitle className="text-xl text-gray-800">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="text-gray-800">
                      ৳{totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="text-gray-800">৳0.00</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>৳{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3 p-6 pt-0">
                <Button
                  className="h-12 w-full rounded-full bg-red-500 hover:bg-red-600"
                  onClick={handleCheckout}
                  disabled={isLoading || isRemoving}
                >
                  {isLoading || isRemoving
                    ? "Processing..."
                    : "Proceed to Checkout"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
