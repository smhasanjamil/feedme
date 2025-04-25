import axios from 'axios';

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://feedme-backend-zeta.vercel.app/api';

// Order tracking response interface
export interface OrderTrackingResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    trackingNumber: string;
    estimatedDelivery?: string;
    deliveryDate: string;
    deliverySlot: string;
    status: string;
    currentLocation?: string;
    facility?: string;
    placedDate?: string;
    lastUpdated?: string;
    trackingStages?: {
      placed: boolean;
      approved: boolean;
      processed: boolean;
      shipped: boolean;
      delivered: boolean;
    };
    transaction?: {
      id: string;
      transactionStatus: string;
    };
    // Additional fields from the API response
    _id: string;
    user: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    meals: Array<{
      customization: {
        spiceLevel: string;
        removedIngredients: string[];
        addOns: string[];
      };
      mealId: {
        nutritionalInfo: {
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
        };
        _id: string;
        name: string;
        providerId: string;
        ingredients: string[];
        portionSize: string;
        price: number;
        image: string;
        category: string;
        description: string;
        preparationTime: number;
        isAvailable: boolean;
      };
      quantity: number;
      price: number;
      subtotal: number;
      _id: string;
    }>;
    subtotal: number;
    tax: number;
    shipping: number;
    totalPrice: number;
    trackingUpdates: Array<{
      stage: string;
      timestamp: string;
      message: string;
      _id: string;
    }>;
    createdAt: string;
    updatedAt: string;
  }
}

// Function to track order by tracking number
export const trackOrder = async (trackingNumber: string): Promise<OrderTrackingResponse> => {
  try {
    const response = await axios.get<OrderTrackingResponse>(
      `${API_BASE_URL}/orders/tracking/${trackingNumber}`
    );
    return response.data;
  } catch (error) {
    console.error('Error tracking order:', error);
    throw error;
  }
}; 