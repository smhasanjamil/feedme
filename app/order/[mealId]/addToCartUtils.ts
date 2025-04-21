import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { toast } from "react-hot-toast";

export interface MealDetails {
  _id: string;
  name: string;
  price: number;
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
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast.error(error?.data?.message || "Failed to add item to cart");
      return false;
    }
  };

  return {
    addToCart,
    isLoading
  };
}; 