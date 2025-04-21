'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingBag, MinusCircle, PlusCircle } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAppSelector } from '@/redux/hooks';
import { currentUser } from '@/redux/features/auth/authSlice';
import { useGetMealByIdQuery } from '@/redux/meal/mealApi';
import { getMealImageUrl } from '../../order/[mealId]/addToCartUtils';

// Server-safe date formatter helper
const formatDate = (dateString: string) => {
  try {
    // Ensure consistent date formatting between server and client
    const date = new Date(dateString);
    // Use explicit formatting that doesn't depend on locale
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    });
  } catch {
    // Return original string if parsing fails
    return dateString;
  }
};

// Define appropriate types for cart items
interface CartItemType {
  _id: string;
  mealId: string;
  mealName: string;
  providerName: string;
  price: number;
  quantity: number;
  deliveryDate: string;
  deliverySlot: string;
  imageUrl?: string;
  customization?: {
    spiceLevel?: string;
    removedIngredients?: string[];
    specialInstructions?: string;
    addOns?: Array<{
      _id?: string;
      name: string;
      price: number;
    }>;
  };
}

interface CartItemProps {
  item: CartItemType;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

const CartItem = ({ item, removeItem, updateQuantity }: CartItemProps) => {
  // Fetch meal details to get the image if it's not in the cart item
  const { data: mealData } = useGetMealByIdQuery(item.mealId, {
    skip: !!item.imageUrl // Skip if we already have an image URL
  });
  
  // Use the utility function to get the image URL
  const imageUrl = getMealImageUrl(item) || (mealData?.data ? getMealImageUrl(mealData.data) : null);
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(item._id, newQuantity);
    }
  };
  
  return (
    <Card key={item._id} className="w-full mb-4 border-none shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-32 h-32 relative bg-gray-100 rounded-lg overflow-hidden">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={item.mealName} 
                className="w-full h-full object-cover"
              />
            ) : (
              /* Placeholder when no image available */
              <div className="flex items-center justify-center h-full text-gray-400">
                <ShoppingBag className="h-8 w-8" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-xl text-gray-800">{item.mealName}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Provider: <span className="font-medium">{item.providerName}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Delivery: <span className="font-medium">{formatDate(item.deliveryDate)} ({item.deliverySlot})</span>
            </p>
            
            {item.customization && (
              <div className="mt-3 bg-gray-50 rounded-lg p-2">
                {item.customization.spiceLevel && (
                  <p className="text-xs text-gray-700">
                    <span className="font-medium">Spice Level:</span> {item.customization.spiceLevel}
                  </p>
                )}
                
                {item.customization.removedIngredients && item.customization.removedIngredients.length > 0 && (
                  <p className="text-xs text-gray-700">
                    <span className="font-medium">Removed:</span> {item.customization.removedIngredients.join(', ')}
                  </p>
                )}
                
                {item.customization.specialInstructions && (
                  <p className="text-xs text-gray-700">
                    <span className="font-medium">Special Instructions:</span> {item.customization.specialInstructions}
                  </p>
                )}
              </div>
            )}
            
            {item.customization?.addOns && item.customization.addOns.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-700">Add-ons:</p>
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
          </div>
          
          <div className="flex flex-col items-end justify-between">
            <p className="font-bold text-lg text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
            
            <div className="flex items-center mt-3 bg-gray-100 rounded-full p-1">
              <button 
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="text-gray-500 hover:text-red-500 transition-colors p-1"
                disabled={item.quantity <= 1}
              >
                <MinusCircle className="h-5 w-5" />
              </button>
              <span className="mx-3 text-center font-medium w-6">{item.quantity}</span>
              <button 
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="text-gray-500 hover:text-green-500 transition-colors p-1"
              >
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 hover:bg-red-50 hover:text-red-600 mt-3 h-8 px-2"
              onClick={() => removeItem(item._id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CartPage = () => {
  const router = useRouter();
  const user = useAppSelector(currentUser);
  const { cart, totalAmount, isLoading, error, removeItem, updateQuantity } = useCart();
  // Add client-side only state
  const [mounted, setMounted] = React.useState(false);

  // If user is not logged in, redirect to login
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    setMounted(true);
  }, [user, router]);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.push('/find-meals');
  };

  // Render a common empty skeleton first for both server and client
  if (!mounted) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>
        <div className="grid grid-cols-1 gap-4">
          <Card className="w-full">
            <CardContent>
              <div className="text-center">
                <div className="h-6 w-full mb-4"></div>
                <div className="h-10 w-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Now handle client-side only rendering
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="w-full mb-4 border-none shadow-sm">
              <CardContent>
                <div className="flex items-center">
                  <div className="bg-accent animate-pulse h-24 w-24 rounded-lg mr-6"></div>
                  <div className="flex-1">
                    <div className="bg-accent animate-pulse h-6 w-3/4 mb-2 rounded-md"></div>
                    <div className="bg-accent animate-pulse h-4 w-1/2 mb-2 rounded-md"></div>
                    <div className="bg-accent animate-pulse h-4 w-1/3 rounded-md"></div>
                  </div>
                  <div className="bg-accent animate-pulse h-8 w-20 rounded-md"></div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"></div>
            <div className="lg:col-span-1">
              <Card className="w-full border-none shadow-sm">
                <CardContent>
                  <div className="space-y-4 py-4">
                    <div className="bg-accent animate-pulse h-6 w-1/2 rounded-md"></div>
                    <div className="bg-accent animate-pulse h-4 w-full rounded-md"></div>
                    <div className="bg-accent animate-pulse h-4 w-full rounded-md"></div>
                    <div className="bg-accent animate-pulse h-6 w-3/4 rounded-md"></div>
                    <div className="bg-accent animate-pulse h-10 w-full rounded-md"></div>
                    <div className="bg-accent animate-pulse h-10 w-full rounded-md"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>
        <div className="grid grid-cols-1 gap-4">
          <Card className="w-full border-none shadow-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative mb-6">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
                <Button onClick={handleContinueShopping} className="mt-2 bg-red-500 hover:bg-red-600">
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>
        <div className="grid grid-cols-1 gap-4">
          <Card className="w-full border-none shadow-sm">
            <CardContent className="p-10">
              <div className="text-center">
                <div className="mb-6">
                  <ShoppingBag className="h-16 w-16 mx-auto text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Looks like you haven&apos;t added any meals to your cart yet. Browse our delicious menu and add items to your cart!
                </p>
                <div className="max-w-xs mx-auto">
                  <Button onClick={handleContinueShopping} className="w-full h-12 bg-red-500 hover:bg-red-600 rounded-full">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Browse Meals
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.map((item) => (
            <CartItem 
              key={item._id} 
              item={item} 
              removeItem={removeItem} 
              updateQuantity={updateQuantity}
            />
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <Card className="w-full border-none shadow-sm">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-xl text-gray-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="text-gray-800">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="text-gray-800">$0.00</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3 p-6 pt-0">
                <Button 
                  className="w-full h-12 bg-red-500 hover:bg-red-600 rounded-full" 
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full" 
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 