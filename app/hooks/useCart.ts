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
      
      const response = await removeItemApi(removePayload).unwrap();
      
      if (response?.status) {
        // Success - no need to show toast as the UI already reflects the action
        console.log('Item successfully removed');
      }
    } catch (error) {
      // Log the error but don't show to user since the UI is already updated
      console.error('Error removing item:', error);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user?.email || !itemId) {
      console.error('Missing required parameters', { itemId, email: user?.email });
      return;
    }
    
    if (quantity < 1) {
      console.error('Invalid quantity value', { quantity });
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
      
      // Call the API
      const response = await updateQuantityApi(updatePayload).unwrap();
      
      if (response?.status) {
        // Success - no need to show toast as the UI already reflects the action
        console.log('Quantity successfully updated');
      }
    } catch (error) {
      // Log the error but don't show to user since the UI is already updated
      console.error('Error updating quantity:', error);
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