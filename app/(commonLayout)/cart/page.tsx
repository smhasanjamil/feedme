'use client';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { 
  removeFromCart, 
  updateQuantity, 
  clearCart 
} from '@/redux/features/cart/cartSlice';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, MinusCircle, PlusCircle, Truck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [isClient, setIsClient] = useState(false);

  // Constants for calculations
  const TAX_RATE = 0.05; // 5% tax
  const SHIPPING_COST = 5.99; // $5.99 shipping

  // This useEffect ensures we only render the cart items on the client
  // to avoid hydration errors from server/client mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * TAX_RATE;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    return subtotal + tax + SHIPPING_COST;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Navigate to checkout page directly
    router.push('/checkout');
  };

  // Show a loading state until client-side rendering is ready
  if (!isClient) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some delicious meals to get started</p>
            <Button onClick={() => router.push('/find-meals')}>
              Browse Meals
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row gap-4 pb-6 border-b">
                        <div className="w-full sm:w-24 h-24 overflow-hidden rounded-md">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                          
                          {item.customizations && Object.keys(item.customizations).length > 0 && (
                            <div className="mt-2 text-sm text-gray-500">
                              {item.customizations.spiceLevel && (
                                <p>Spice Level: {item.customizations.spiceLevel}</p>
                              )}
                              {item.customizations.removedIngredients && item.customizations.removedIngredients.length > 0 && (
                                <p>Removed: {item.customizations.removedIngredients.join(', ')}</p>
                              )}
                              {item.customizations.noteToChef && (
                                <p>Note: {item.customizations.noteToChef}</p>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                              <span className="mx-2">{item.quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              >
                                <PlusCircle className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (5%)</span>
                      <span>${calculateTax().toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <div className="flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        <span>Shipping</span>
                      </div>
                      <span>${SHIPPING_COST.toFixed(2)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        onClick={handleCheckout}
                        className="w-full bg-red-500 hover:bg-red-600 text-white"
                      >
                        Checkout
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-2"
                        onClick={() => router.push('/find-meals')}
                      >
                        Continue Shopping
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full mt-2 text-red-500 hover:text-red-700"
                        onClick={() => dispatch(clearCart())}
                      >
                        Clear Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 