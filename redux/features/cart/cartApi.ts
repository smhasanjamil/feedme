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
      queryFn: async (arg, { getState }, _extraOptions, baseQuery) => {
        const { itemId, email } = arg;
        // We'll try multiple endpoint patterns to discover the correct one
        const endpointPatterns = [
          `/cart/${itemId}?email=${email || ''}`,                // Basic pattern
          `/cart/items/${itemId}?email=${email || ''}`,          // With 'items' collection
          `/cart/item/${itemId}?email=${email || ''}`,           // With singular 'item'
          `/cart-items/${itemId}?email=${email || ''}`,          // Hyphenated collection
          `/carts/${itemId}?email=${email || ''}`                // Plural 'carts'
        ];
        
        let lastError = null;
        
        // Try each endpoint pattern until one works
        for (const endpoint of endpointPatterns) {
          try {
            console.log(`Trying DELETE request to ${endpoint}`);
            
            const result = await baseQuery({
              url: endpoint,
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              }
            });
            
            if (!result.error) {
              console.log(`Successful endpoint found: ${endpoint}`);
              return { data: result.data as CartResponse };
            }
            
            lastError = result.error;
            console.log(`Endpoint ${endpoint} failed with status: ${result.error?.status || 'unknown'}`);
          } catch (err) {
            console.error(`Error trying endpoint ${endpoint}:`, err);
            lastError = lastError || { status: 'FETCH_ERROR', error: String(err) };
          }
        }
        
        // If we get here, all endpoints failed - ensure lastError is not null/undefined
        if (!lastError) {
          lastError = { status: 404, data: { message: 'All endpoint patterns failed with unknown error' } };
        }
        
        console.error('All endpoint patterns failed. Last error:', lastError);
        
        // Always return a properly structured error object
        return { 
          error: { 
            status: lastError?.status || 404, 
            data: {
              message: lastError?.data?.message || 'API Not Found',
              status: lastError?.status || 404,
              data: null,
              success: false
            }
          } 
        };
      },
      invalidatesTags: ["User"],
    }),
    
    updateCartItem: builder.mutation<
      CartResponse, 
      { itemId: string, quantity: number, email?: string }
    >({
      queryFn: async (arg, { getState }, _extraOptions, baseQuery) => {
        const { itemId, quantity, email } = arg;
        // We'll try multiple endpoint patterns to discover the correct one
        const endpointPatterns = [
          `/cart/${itemId}?email=${email || ''}`,                // Basic pattern
          `/cart/items/${itemId}?email=${email || ''}`,          // With 'items' collection
          `/cart/item/${itemId}?email=${email || ''}`,           // With singular 'item'
          `/cart/update-quantity/${itemId}?email=${email || ''}`, // Explicit action
          `/cart-items/${itemId}?email=${email || ''}`,          // Hyphenated collection
          `/carts/${itemId}?email=${email || ''}`                // Plural 'carts'
        ];
        
        let lastError = null;
        
        // Try each endpoint pattern until one works
        for (const endpoint of endpointPatterns) {
          try {
            console.log(`Trying PATCH request to ${endpoint} with quantity ${quantity}`);
            
            const result = await baseQuery({
              url: endpoint,
              method: 'PATCH',
              body: { quantity },
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              }
            });
            
            if (!result.error) {
              console.log(`Successful endpoint found: ${endpoint}`);
              return { data: result.data as CartResponse };
            }
            
            lastError = result.error;
            console.log(`Endpoint ${endpoint} failed with status: ${result.error?.status || 'unknown'}`);
          } catch (err) {
            console.error(`Error trying endpoint ${endpoint}:`, err);
            lastError = lastError || { status: 'FETCH_ERROR', error: String(err) };
          }
        }
        
        // If we get here, all endpoints failed - ensure lastError is not null/undefined
        if (!lastError) {
          lastError = { status: 404, data: { message: 'All endpoint patterns failed with unknown error' } };
        }
        
        console.error('All endpoint patterns failed. Last error:', lastError);
        
        // Always return a properly structured error object
        return { 
          error: { 
            status: lastError?.status || 404, 
            data: {
              message: lastError?.data?.message || 'API Not Found',
              status: lastError?.status || 404,
              data: null,
              success: false
            }
          } 
        };
      },
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