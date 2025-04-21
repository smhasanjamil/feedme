import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCartData, clearCart, setLoading, setError } from '@/redux/features/cart/cartSlice';
import { useGetCartQuery, useRemoveFromCartMutation, useUpdateCartItemMutation } from '@/redux/features/cart/cartApi';
import { toast } from 'react-hot-toast';
import { currentUser } from '@/redux/features/auth/authSlice';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector(state => state.cart);
  const user = useAppSelector(currentUser);
  
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
    try {
      const response = await removeItemApi({ 
        itemId, 
        email: user?.email 
      }).unwrap();
      if (response.status) {
        toast.success(response.message || 'Item removed from cart');
        refetch();
      } else {
        toast.error(response.message || 'Failed to remove item');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to remove item');
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const response = await updateQuantityApi({
        itemId,
        quantity,
        email: user?.email
      }).unwrap();
      if (response.status) {
        toast.success(response.message || 'Quantity updated');
        refetch();
      } else {
        toast.error(response.message || 'Failed to update quantity');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update quantity');
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