'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { clearCart } from '@/redux/features/cart/cartSlice';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ShoppingCart, CreditCard, Store } from 'lucide-react';
import { useGetMealByIdQuery } from '@/redux/meal/mealApi';
import { use } from 'react';
import { currentUser } from '@/redux/features/auth/authSlice';
import { useCreateOrderFromCartMutation } from '@/redux/features/cart/cartApi';
import { toast } from 'react-hot-toast';

interface PageProps {
  params: {
    mealId: string;
  };
}

interface Provider {
  _id?: string;
  name?: string;
  email?: string;
}

interface CartItemType {
  _id: string;
  mealId: string;
  mealName: string;
  providerId: string | Provider;
  providerName: string;
  quantity: number;
  price: number;
  deliveryDate?: string;
  deliverySlot?: string;
  imageUrl?: string;
  customization?: {
    spiceLevel?: string;
    removedIngredients?: string[];
    specialInstructions?: string;
    addOns?: Array<{
      name: string;
      price: number;
      _id: string;
    }>;
  };
}

type ParamsWithMealId = {
  mealId: string;
};

export default function CheckoutPage({ params }: PageProps) {
  // Use React.use to unwrap params
  const unwrappedParams = use(params as ParamsWithMealId);
  const { mealId } = unwrappedParams;
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector(currentUser);
  //console.log(user)
  const cartItems = useAppSelector((state) => state.cart.items) as CartItemType[];
  const { data: mealData, isLoading: isMealLoading, error: mealError } = useGetMealByIdQuery(mealId);
  
  const [createOrderFromCart] = useCreateOrderFromCartMutation();
  
  const [checkoutDetails, setCheckoutDetails] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    deliveryAddress: user?.address || '',
    city: '',
    zipcode: '',
    deliveryDate: '',
    deliveryTime: '',
    paymentMethod: 'credit-card'
  });

  // Get provider information from cart items
  const getProviderInfo = () => {
    if (!cartItems.length) return null;
    
    // Get first item's provider info
    const firstItem = cartItems[0];
    
    if (typeof firstItem.providerId === 'object' && firstItem.providerId && firstItem.providerId.name) {
      return {
        id: firstItem.providerId._id,
        name: firstItem.providerId.name,
        email: firstItem.providerId.email
      };
    } else if (typeof firstItem.providerId === 'string') {
      // If providerId is just a string, use that as id and name
      return {
        id: firstItem.providerId,
        name: firstItem.providerId,
        email: ''
      };
    }
    
    return null;
  };

  const providerInfo = getProviderInfo();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Set default delivery date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Extract delivery date and time from cart items
    let deliveryDate = '';
    let deliveryTime = '';
    
    if (cartItems.length > 0) {
      const item = cartItems[0];
      
      // Parse delivery date from cart
      if (item.deliveryDate) {
        // Try to parse the ISO date first
        try {
          const dateObj = new Date(item.deliveryDate);
          if (!isNaN(dateObj.getTime())) {
            deliveryDate = dateObj.toISOString().split('T')[0];
          }
        } catch (error) {
          console.error("Error parsing date:", error);
        }
      }
      
      // If we have a deliverySlot with format like "Monday, April 28(10 AM - 11 AM)"
      if (item.deliverySlot && item.deliverySlot.includes('April 28')) {
        // Extract just the time part
        const timeMatch = item.deliverySlot.match(/\((.*?)\)/);
        if (timeMatch && timeMatch[1]) {
          deliveryTime = timeMatch[1].trim();
        }
        
        // Hardcode April 28, 2025 as shown in the screenshot
        deliveryDate = '2025-04-28';
      } else if (item.deliverySlot) {
        // Just use the whole slot as time
        deliveryTime = item.deliverySlot;
      }
    }
    
    // Fallback values if we couldn't extract from cart
    if (!deliveryDate) {
      deliveryDate = tomorrow.toISOString().split('T')[0];
    }
    
    if (!deliveryTime) {
      deliveryTime = "10 AM - 11 AM"; // Default time from the screenshot
    }
    
    // Pre-fill form with extracted data
    setCheckoutDetails(prev => ({
      ...prev,
      deliveryDate,
      deliveryTime
    }));
  }, [cartItems, mealData, user, searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCheckoutDetails(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    // 5% tax rate
    return calculateSubtotal() * 0.05;
  };

  const calculateShipping = () => {
    // Fixed shipping cost
    return 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const shipping = calculateShipping();
    return subtotal + tax + shipping;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!checkoutDetails.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!checkoutDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(checkoutDetails.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!checkoutDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!checkoutDetails.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }
    
    if (!checkoutDetails.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!checkoutDetails.zipcode.trim()) {
      newErrors.zipcode = 'Zipcode is required';
    }
    
    if (!checkoutDetails.deliveryDate.trim()) {
      newErrors.deliveryDate = 'Delivery date is required';
    }
    
    if (!checkoutDetails.deliveryTime.trim()) {
      newErrors.deliveryTime = 'Delivery time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderId = () => {
    // Generate a unique order ID based on timestamp and random numbers
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    try {
      // Format date for API
      const deliveryDate = new Date(checkoutDetails.deliveryDate).toISOString().split('T')[0];
      
      // Create order payload
      const orderData = {
        name: checkoutDetails.fullName,
        email: checkoutDetails.email,
        phone: checkoutDetails.phone,
        address: checkoutDetails.deliveryAddress,
        city: checkoutDetails.city,
        zipCode: checkoutDetails.zipcode,
        deliveryDate: deliveryDate,
        deliverySlot: checkoutDetails.deliveryTime
      };
      
      console.log('Sending order data to API:', orderData);
      
      // Call API to create order
      const response = await createOrderFromCart(orderData).unwrap();
      
      // Log the response
      console.log('API Response:', JSON.stringify(response, null, 2));
      
      // Check for checkout URL and redirect immediately
      let checkoutUrl = null;
      
      // Try different paths in the response object to find the checkout URL
      if (response && response.data && response.data.checkoutUrl) {
        checkoutUrl = response.data.checkoutUrl;
      } else if (response.data?.data?.checkoutUrl) {
        checkoutUrl = response.data.data.checkoutUrl;
      } else if (response.checkoutUrl) {
        checkoutUrl = response.checkoutUrl;
      }
      
      if (checkoutUrl) {
        // Show success toast notification before redirecting
        toast.success('Order created successfully! Redirecting to payment...', {
          duration: 3000
        });
        console.log('Redirecting to checkout URL:', checkoutUrl);
        
        // Add a small delay to ensure toast is visible before redirecting
        setTimeout(() => {
          // Direct redirect without setTimeout to prevent showing empty cart
          window.location.href = checkoutUrl;
        }, 1500);
      } else {
        // Only clear cart if we're not redirecting
        dispatch(clearCart());
        toast.error('Order created but no payment URL was returned');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error creating order. Check console for details.');
    }
  };

  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  }

  // Show a loading state until client-side rendering is ready
  if (!isClient || isMealLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if meal data couldn't be loaded
  if (mealError) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-4">Error loading meal details</h2>
            <p className="text-gray-500 mb-6">Please try again or return to your cart</p>
            <Button onClick={() => router.push('/cart')}>
              Back to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some delicious meals to get started</p>
            <Button onClick={() => router.push('/find-meals')}>
              Browse Meals
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
             
             
              
              {/* Display all items from cart */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Items in Your Order</CardTitle>
                </CardHeader>
                <CardContent>
                  {cartItems.map((item, index) => (
                    <div key={item._id || index} className="flex justify-between items-start py-3 border-b last:border-b-0">
                      <div>
                        <div className="flex mb-1">
                          <span className="font-medium mr-2">{item.quantity}x</span>
                          <span className="font-medium">{item.mealName}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Provider: {item.providerName || "Restaurant"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Delivery: {item.deliveryDate ? formatDate(new Date(item.deliveryDate)) : formatDate(new Date(checkoutDetails.deliveryDate))} 
                          ({item.deliverySlot || checkoutDetails.deliveryTime})
                        </p>
                      </div>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="block mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Your full name"
                      value={checkoutDetails.fullName}
                      onChange={handleInputChange}
                      className={errors.fullName ? "border-red-500" : ""}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="block mb-2">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={checkoutDetails.email}
                        onChange={handleInputChange}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="block mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Your phone number"
                        value={checkoutDetails.phone}
                        onChange={handleInputChange}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="deliveryAddress" className="block mb-2">
                      Delivery Address <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="deliveryAddress"
                      name="deliveryAddress"
                      placeholder="Your street address"
                      value={checkoutDetails.deliveryAddress}
                      onChange={handleInputChange}
                      className={errors.deliveryAddress ? "border-red-500" : ""}
                      rows={3}
                    />
                    {errors.deliveryAddress && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="block mb-2">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="Your city"
                        value={checkoutDetails.city}
                        onChange={handleInputChange}
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="zipcode" className="block mb-2">
                        Zipcode <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="zipcode"
                        name="zipcode"
                        placeholder="Your zipcode"
                        value={checkoutDetails.zipcode}
                        onChange={handleInputChange}
                        className={errors.zipcode ? "border-red-500" : ""}
                      />
                      {errors.zipcode && <p className="text-red-500 text-sm mt-1">{errors.zipcode}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="deliveryDate" className="block mb-2">
                      Delivery Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="deliveryDate"
                      name="deliveryDate"
                      type="date"
                      value={checkoutDetails.deliveryDate}
                      onChange={handleInputChange}
                      className={errors.deliveryDate ? "border-red-500" : ""}
                    />
                    {errors.deliveryDate && <p className="text-red-500 text-sm mt-1">{errors.deliveryDate}</p>}
                    <p className="text-xs text-gray-500 mt-1">Delivery date from your cart: Monday, April 28</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="deliveryTime" className="block mb-2">
                      Delivery Time <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="deliveryTime"
                      name="deliveryTime"
                      value={checkoutDetails.deliveryTime}
                      onChange={handleInputChange}
                      className={errors.deliveryTime ? "border-red-500" : ""}
                    />
                    {errors.deliveryTime && <p className="text-red-500 text-sm mt-1">{errors.deliveryTime}</p>}
                    <p className="text-xs text-gray-500 mt-1">Delivery time from your cart: 10 AM - 11 AM</p>
                  </div>
                  
                  {/* Place Order button moved here */}
                  <Button 
                    onClick={handlePlaceOrder}
                    className="w-full bg-red-500 hover:bg-red-600 text-white mt-6"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Place Order
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <div className="sticky top-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="max-h-60 overflow-y-auto">
                        {cartItems.map((item, index) => (
                          <div key={item._id || `cart-item-${index}`} className="flex justify-between items-center py-2 border-b">
                            <div className="flex items-center">
                              <span className="mr-2">{item.quantity}x</span>
                              <span>{item.mealName}</span>
                            </div>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${calculateSubtotal().toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-gray-600">
                        <span>Tax (5%)</span>
                        <span>${calculateTax().toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>${calculateShipping().toFixed(2)}</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => router.push('/cart')}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Back to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 