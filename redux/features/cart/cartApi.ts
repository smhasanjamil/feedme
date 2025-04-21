import { baseApi } from "@/redux/api/baseApi";

// Interface for add to cart request payload
export interface AddToCartRequest {
  mealId: string;
  mealName: string;
  providerId: string;
  providerName: string;
  quantity: number;
  price: number;
  deliveryDate: string;
  deliverySlot: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  deliveryAddress: string;
  customization?: {
    spiceLevel?: string;
    removedIngredients?: string[];
    addOns?: Array<{
      name: string;
      price: number;
    }>;
    specialInstructions?: string;
  };
}

// Cart item response interface
export interface CartItem {
  _id: string;
  mealId: string;
  mealName: string;
  providerId: string;
  providerName: string;
  quantity: number;
  price: number;
  deliveryDate: string;
  deliverySlot: string;
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

// Cart response interface
export interface CartResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    _id: string;
    userId: string;
    customerName: string;
    customerId: string;
    items: CartItem[];
    totalAmount: number;
    deliveryAddress: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    customerEmail: string;
  };
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addToCart: builder.mutation<CartResponse, AddToCartRequest>({
      query: (data) => ({
        url: `/cart`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    
    getCart: builder.query<CartResponse, string | void>({
      query: (email) => ({
        url: email ? `/cart/by-email?email=${email}` : `/cart`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    
    removeFromCart: builder.mutation<CartResponse, { itemId: string, email?: string }>({
      query: ({ itemId, email }) => ({
        url: email ? `/cart/${itemId}?email=${email}` : `/cart/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    
    updateCartItem: builder.mutation<
      CartResponse, 
      { itemId: string, quantity: number, email?: string }
    >({
      query: ({ itemId, quantity, email }) => ({
        url: email ? `/cart/${itemId}?email=${email}` : `/cart/${itemId}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} = cartApi; 