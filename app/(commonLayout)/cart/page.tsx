'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCart } from '../../hooks/useCart';
import { useAppSelector } from '@/redux/hooks';
import { currentUser } from '@/redux/features/auth/authSlice';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const CartPage = () => {
  const router = useRouter();
  const user = useAppSelector(currentUser);
  const { cart, totalAmount, isLoading, error, removeItem, updateQuantity } = useCart();

  // If user is not logged in, redirect to login
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleQuantityChange = (itemId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    } else if (newQuantity === 0) {
      removeItem(itemId);
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.push('/find-meals');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="w-full">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <Skeleton className="h-24 w-24 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <div className="flex flex-col items-end">
                    <Skeleton className="h-6 w-20 mb-2" />
                    <Skeleton className="h-10 w-28" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <Button onClick={handleContinueShopping} className="mt-4">
          Continue Shopping
        </Button>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-6">
            Looks like you haven&apos;t added any meals to your cart yet.
          </p>
          <Button onClick={handleContinueShopping} className="w-full">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Browse Meals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {cart.map((item) => (
            <Card key={item._id} className="mb-4">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-24 h-24 relative bg-gray-100 rounded-md">
                    {/* Placeholder for meal image */}
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Trash2 className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.mealName}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Provider: {item.providerName}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Delivery: {format(new Date(item.deliveryDate), 'MMM d, yyyy')} ({item.deliverySlot})
                    </p>
                    
                    {item.customization && (
                      <div className="mt-2">
                        {item.customization.spiceLevel && (
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Spice Level:</span> {item.customization.spiceLevel}
                          </p>
                        )}
                        
                        {item.customization.removedIngredients && item.customization.removedIngredients.length > 0 && (
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Removed:</span> {item.customization.removedIngredients.join(', ')}
                          </p>
                        )}
                        
                        {item.customization.specialInstructions && (
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Special Instructions:</span> {item.customization.specialInstructions}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end justify-between">
                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    
                    <div className="flex items-center mt-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input 
                        className="w-12 h-8 mx-1 text-center" 
                        value={item.quantity} 
                        readOnly
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 mt-2 h-8 px-2"
                      onClick={() => removeItem(item._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
                
                {item.customization?.addOns && item.customization.addOns.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-600">Add-ons:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.customization.addOns.map((addon, index) => (
                        <span 
                          key={addon._id || index} 
                          className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                        >
                          {addon.name} (+${addon.price.toFixed(2)})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>$0.00</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button 
                className="w-full" 
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 