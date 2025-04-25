import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem as ApiCartItem } from "./cartApi";

// Provider interface
interface Provider {
  _id: string;
  name: string;
  email?: string;
}

export interface CartItem {
  _id: string;
  mealId: string;
  mealName: string;
  providerId: string | Provider;
  providerName: string;
  quantity: number;
  price: number;
  deliveryDate: string;
  deliverySlot: string;
  imageUrl?: string;
  customization?: {
    spiceLevel?: string;
    removedIngredients?: string[];
    addOns?: Array<{
      name: string;
      price: number;
      _id: string;
    }>;
    specialInstructions?: string;
  };
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  cartId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  cartId: null,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartData: (
      state,
      action: PayloadAction<{
        _id: string;
        items: ApiCartItem[];
        totalAmount: number;
      }>,
    ) => {
      state.items = action.payload.items;
      state.totalAmount = action.payload.totalAmount;
      state.cartId = action.payload._id;
    },

    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item.mealId === action.payload.mealId,
      );

      if (existingItemIndex >= 0) {
        // If item exists, update quantity
        state.items[existingItemIndex].quantity += action.payload.quantity;
      } else {
        // Otherwise add new item
        state.items.push(action.payload);
      }

      // Recalculate total amount
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);

      // Recalculate total amount
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === id);
      if (item) {
        item.quantity = quantity;

        // Recalculate total amount
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.cartId = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCartData,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setLoading,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer;
