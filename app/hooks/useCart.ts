import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
  setCartData, 
  updateQuantity as updateQuantityLocal,
  removeFromCart as removeFromCartLocal,
  setLoading, 
  setError 
} from '@/redux/features/cart/cartSlice';
import { useGetCartQuery, useRemoveFromCartMutation, useUpdateCartItemMutation } from '@/redux/features/cart/cartApi';
import { toast } from 'react-hot-toast';
import { currentUser } from '@/redux/features/auth/authSlice';
import { useRouter } from 'next/navigation';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector(state => state.cart);
  const user = useAppSelector(currentUser);
  const router = useRouter();
  
  const { data, isLoading, error, refetch } = useGetCartQuery(user?.email, {
    skip: !user, // Skip the query if user is not logged in
  });
  
  const [removeItemApi, { isLoading: isRemoving }] = useRemoveFromCartMutation();
  const [updateQuantityApi, { isLoading: isUpdating }] = useUpdateCartItemMutation();

  // Sync cart data from API
  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
    }
    
    if (error) {
      dispatch(setError((error as any)?.data?.message || 'Failed to fetch cart'));
    } else {
      dispatch(setError(null));
    }
    
    if (data?.status && data?.data) {
      dispatch(setCartData({
        _id: data.data._id,
        items: data.data.items,
        totalAmount: data.data.totalAmount
      }));
    }
  }, [data, isLoading, error, dispatch]);

  // Remove item from cart
  const removeItem = async (itemId: string) => {
    if (!user?.email || !itemId) {
      console.error('Missing required parameters for item removal', { itemId, email: user?.email });
      toast.error('Unable to remove item: missing information');
      return;
    }
    
    // Always update local state first for better UX
    dispatch(removeFromCartLocal(itemId));
    
    try {
      // Create the request payload
      const removePayload = {
        itemId,
        email: user?.email
      };
      
      try {
        // Call the API with error handling
        const response = await removeItemApi(removePayload)
          .unwrap()
          .catch(err => {
            // Handle API errors gracefully
            console.error('API error:', err);
            // Don't show error to user - we've already updated local state
            return null;
          });
        
        if (response?.status) {
          toast.success(response.message || 'Item removed from cart');
          refetch(); // Refresh to ensure server/client sync
        } else if (response) {
          console.error('Remove item failed with response:', JSON.stringify(response));
          toast.error(response.message || 'Failed to remove item');
          refetch(); // Refresh to reset state on failure
        }
      } catch (error: any) {
        // Only show the error toast in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Remove item error:', error);
        }
      }
    } catch (outerError) {
      console.error('Unexpected error in removeItem:', outerError);
      toast.error('An unexpected error occurred');
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user?.email || !itemId) {
      console.error('Missing required parameters', { itemId, email: user?.email });
      toast.error('Unable to update quantity: missing information');
      return;
    }
    
    // Always update local state for better UX
    dispatch(updateQuantityLocal({ id: itemId, quantity }));
    
    try {
      // Create the request payload
      const updatePayload = {
        itemId,
        quantity,
        email: user?.email
      };
      
      try {
        // Call the API with error handling
        const response = await updateQuantityApi(updatePayload)
          .unwrap()
          .catch(err => {
            // Handle API errors gracefully
            console.error('API error:', err);
            // Don't show error to user - we've already updated local state
            return null;
          });
        
        if (response?.status) {
          // Don't show toast for every quantity update as it can be annoying
          refetch(); // Refresh to ensure server/client sync
        } else if (response) {
          console.error('Update quantity failed with response:', JSON.stringify(response));
          toast.error(response.message || 'Failed to update quantity');
          refetch(); // Refresh to reset state on failure
        }
      } catch (error: any) {
        // Only show the error toast in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Update quantity error:', error);
        }
      }
    } catch (outerError) {
      console.error('Unexpected error in updateQuantity:', outerError);
      toast.error('An unexpected error occurred');
    }
  };

  return {
    cart: cartState.items,
    totalAmount: cartState.totalAmount,
    isLoading: cartState.isLoading || isLoading || isRemoving || isUpdating,
    error: cartState.error,
    removeItem,
    updateQuantity,
    refreshCart: refetch
  };
}; 