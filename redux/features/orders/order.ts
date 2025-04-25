import { baseApi } from "@/redux/api/baseApi";

// Define the Order interface based on actual backend data
interface Product {
  _id: string;
  name: string;
  image: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  category: string;
  description: string;
  quantity: number;
  inStock: boolean;
}

interface OrderProduct {
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
  _id: string;
}

// Meal interface for order items
interface MealItem {
  _id: string;
  mealId: {
    _id: string;
    name: string;
    image: string;
    description?: string;
    price?: number;
    nutritionalInfo?: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    ingredients?: string[];
    category?: string;
    portionSize?: string;
    preparationTime?: number;
    [key: string]: string | number | boolean | string[] | object | undefined;
  };
  quantity: number;
  price: number;
  subtotal: number;
  customization?: {
    spiceLevel?: string;
    removedIngredients?: string[];
    addOns?: Array<{name: string; price?: number}>;
    [key: string]: string | string[] | Array<{name: string; price?: number}> | undefined;
  };
}

interface TrackingUpdate {
  stage: string;
  timestamp: string;
  message: string;
  _id?: string;
}

interface Transaction {
  id: string;
  transactionStatus: string;
  bank_status?: string;
  date_time?: string;
  sp_code?: string;
  sp_message?: string;
}

interface TrackingStages {
  placed: boolean;
  approved: boolean;
  processed: boolean;
  shipped: boolean;
  delivered: boolean;
  [key: string]: boolean;
}

// Add rating interface
interface RatingData {
  rating: number;
  comment: string;
  mealId: string;
  orderId: string;
}

interface RatingResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    _id: string;
    rating: number;
    comment: string;
    mealId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Order {
  _id: string;
  user: string;
  name?: string;
  customerFirstName?: string;
  customerLastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  deliveryDate?: string;
  deliverySlot?: string;
  products?:
    | OrderProduct[]
    | { product: string; quantity: number; _id: string }[];
  meals?: MealItem[];
  subtotal?: number;
  tax: number;
  shipping: number;
  totalPrice: number;
  status: string;
  trackingUpdates: TrackingUpdate[];
  trackingNumber?: string;
  transaction?: Transaction;
  trackingStages?: TrackingStages;
  estimatedDelivery?: string;
  estimatedDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Create a more flexible type for the API response
export type ApiOrder = Order & {
  [key: string]: unknown;
};

interface OrderResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: Order[];
}

interface AllOrdersResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: Order[];
}

interface TrackOrderResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    trackingStages: TrackingStages;
    transaction: Transaction;
    _id: string;
    user: string;
    customerFirstName: string;
    customerLastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    products: OrderProduct[];
    subtotal: number;
    tax: number;
    shipping: number;
    totalPrice: number;
    status: string;
    trackingUpdates: TrackingUpdate[];
    trackingNumber: string;
    estimatedDelivery?: string;
    createdAt: string;
    updatedAt: string;
  };
}

const orderApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (userInfo) => ({
        url: "/orders",
        method: "POST",
        body: userInfo,
      }),
    }),
    getOrders: builder.query({
      query: () => "/order",
    }),
    // Endpoint for admin to get all orders
    getAllOrders: builder.query<Order[], void>({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
      transformResponse: (response: AllOrdersResponse) => {
        return response?.data || [];
      },
    }),
    // Endpoint for provider to get their orders
    getProviderOrders: builder.query<Order[], string>({
      query: (providerId) => ({
        url: `/orders/provider/${providerId}/orders`,
        method: "GET",
      }),
      transformResponse: (response: OrderResponse) => {
        return response?.data || [];
      },
    }),
    verifyOrder: builder.query({
      query: (order_id) => ({
        url: "/orders/verify",
        params: { order_id },
        method: "GET",
      }),
    }),
    // Endpoint for getting user orders
    getUserOrders: builder.query<Order[], void>({
      query: () => ({
        url: "/orders/my-orders",
        method: "GET",
      }),
      transformResponse: (response: OrderResponse) => {
        return response?.data || [];
      },
    }),
    // Endpoint for tracking an order by tracking number
    trackOrder: builder.query<TrackOrderResponse["data"], string>({
      query: (trackingNumber) => ({
        url: `/orders/track/${trackingNumber}`,
        method: "GET",
      }),
      transformResponse: (response: TrackOrderResponse) => {
        return response?.data || null;
      },
    }),
    // Endpoint for updating order tracking
    updateOrderTracking: builder.mutation<
      ApiOrder,
      { orderId: string; data: { stage: string; message: string } }
    >({
      query: ({ orderId, data }) => {
        // Ensure exact URL format matches the confirmed API endpoint
        const url = `https://feedme-backend-zeta.vercel.app/api/orders/${orderId}/tracking`;
        console.log('RTK Query making request to:', url);
        console.log('With data:', data);
        
        // Get the token from the Redux store
        // Note: The baseApi already handles this in prepareHeaders, but we're being explicit
        return {
          url,
          method: "PATCH",
          body: data,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        };
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          console.log('Order tracking update success:', result);
        } catch (error) {
          console.error('Order tracking update failed:', error);
        }
      },
      transformResponse: (response: { data: ApiOrder }) => {
        console.log('Tracking update response:', response);
        return response?.data;
      },
    }),
    // Endpoint for deleting an order
    deleteOrder: builder.mutation<{ success: boolean }, string>({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "DELETE",
      }),
      async onQueryStarted(orderId, { queryFulfilled }) {
        try {
          console.log(`Deleting order with id: ${orderId}`);
          await queryFulfilled;
          console.log('Order deleted successfully');
        } catch {
          // Avoid logging the full error object which might be circular
          console.error(`Delete operation failed, but the order might still be deleted. OrderId: ${orderId}`);
        }
      },
      transformResponse: (response: { success: boolean }) => {
        return response;
      },
    }),
    // New endpoint for submitting meal ratings
    submitRating: builder.mutation<RatingResponse["data"], RatingData>({
      query: (ratingData) => ({
        url: `/providers/menu/${ratingData.mealId}/ratings`,
        method: "POST",
        body: {
          rating: ratingData.rating,
          comment: ratingData.comment,
          orderId: ratingData.orderId
        }
      }),
      transformResponse: (response: RatingResponse) => {
        return response?.data || null;
      },
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetAllOrdersQuery,
  useGetProviderOrdersQuery,
  useVerifyOrderQuery,
  useGetUserOrdersQuery,
  useTrackOrderQuery,
  useUpdateOrderTrackingMutation,
  useDeleteOrderMutation,
  useSubmitRatingMutation,
} = orderApi;