import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeFromCart } from "@/redux/features/cart/cartSlice";
import { currentUser } from "@/redux/features/auth/authSlice";
import toast from "react-hot-toast";
import { useRemoveFromCartByEmailMutation } from "@/redux/features/cart/cartApi";

export const useRemoveFromCart = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector(currentUser);
  const [removeFromCartByEmail] = useRemoveFromCartByEmailMutation();

  const removeItem = async (itemId: string) => {
    if (!user?.email) {
      toast.error("You need to be logged in to remove items from cart");
      return false;
    }

    setIsLoading(true);

    try {
      // First update the local state for immediate UI feedback
      dispatch(removeFromCart(itemId));

      // Use the Redux-managed API call instead of direct fetch
      const result = await removeFromCartByEmail({
        mealId: itemId,
        email: user.email,
      }).unwrap();

      if (result.status) {
        toast.success("Item removed successfully from cart");
        return true;
      } else {
        toast.error(result.message || "Failed to remove item from cart");
        return false;
      }
    } catch (error) {
      console.error("Error removing item:", error);

      // Get detailed error message if available
      let errorMsg = "Server error";
      if (error && typeof error === "object") {
        if (
          "data" in error &&
          error.data &&
          typeof error.data === "object" &&
          "message" in error.data
        ) {
          errorMsg = String(error.data.message);
        } else if ("message" in error) {
          errorMsg = String(error.message);
        } else if (
          "status" in error &&
          "status" in error &&
          error.status === 404
        ) {
          errorMsg = "Item not found in cart";
        } else if ("status" in error) {
          errorMsg = `Server returned ${error.status}`;
        }
      }
      console.error("Detailed error:", errorMsg);

      // Show a more user-friendly error message
      toast.error(
        errorMsg === "Item not found in cart"
          ? "This item appears to be already removed from your cart"
          : "Failed to remove item from cart",
      );

      // For 404 errors, we can still return true since the item is not in the cart anyway
      if (errorMsg === "Item not found in cart") {
        return true;
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { removeItem, isLoading };
};
