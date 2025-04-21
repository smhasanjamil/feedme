import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { toast } from "react-hot-toast";

export interface MealDetails {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  provider: {
    _id: string;
    name: string;
  };
}

export interface CustomizationOptions {
  spiceLevel?: string;
  removedIngredients?: string[];
  addOns?: Array<{
    name: string;
    price: number;
  }>;
  specialInstructions?: string;
}

// Utility function to get image URL from a meal object
// This handles the different property names between meals and cart items
export const getMealImageUrl = (meal: { imageUrl?: string; image?: string }): string | undefined => {
  // Try various possible image properties
  return meal?.imageUrl || meal?.image || undefined;
};

export const useAddToCart = () => {
  const [addToCartApi, { isLoading }] = useAddToCartMutation();
  const user = useAppSelector(currentUser);

  const addToCart = async (
    meal: MealDetails,
    quantity: number,
    deliveryDate: string,
    deliverySlot: string,
    customization?: CustomizationOptions,
    deliveryAddress: string = "Default Address"
  ) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return false;
    }

    try {
      const payload = {
        mealId: meal._id,
        mealName: meal.name,
        providerId: meal.provider._id,
        providerName: meal.provider.name,
        quantity,
        price: meal.price,
        imageUrl: meal.imageUrl,
        deliveryDate,
        deliverySlot,
        customization,
        userId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        deliveryAddress
      };

      console.log('Sending payload to API:', payload);

      const response = await addToCartApi(payload).unwrap();
      
      if (response.status) {
        toast.success(response.message || "Item added to cart successfully");
        return true;
      } else {
        toast.error(response.message || "Failed to add item to cart");
        return false;
      }
    } catch (error: unknown) {
      console.error('Error adding to cart:', error);
      
      // Improved error handling with detailed messages
      let errorMessage = "Failed to add item to cart";
      
      // Type guard for error with data property
      if (error && typeof error === 'object' && 'data' in error && 
          error.data && typeof error.data === 'object' && 'message' in error.data) {
        errorMessage = String(error.data.message);
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      } else if (error && typeof error === 'object' && 'status' in error && error.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
        errorMessage = "Service unavailable. Please try again later.";
      } else if (!navigator.onLine) {
        errorMessage = "You appear to be offline. Please check your connection.";
      }
      
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    addToCart,
    isLoading
  };
}; 