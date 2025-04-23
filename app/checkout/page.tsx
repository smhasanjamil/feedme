'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { clearCart } from '@/redux/features/cart/cartSlice';
import { useCreateOrderFromCartMutation } from '@/redux/features/cart/cartApi';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart, CreditCard, Clock, MapPin, Calendar, Store } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [createOrderFromCart] = useCreateOrderFromCartMutation();
  
  const [checkoutDetails, setCheckoutDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    deliveryAddress: searchParams.get('deliveryAddress') || '',
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

  // Get delivery information from cart items
  const getDeliveryInfo = () => {
    if (!cartItems.length) return null;
    
    // Get first item's delivery info
    const firstItem = cartItems[0];
    
    return {
      deliverySlot: firstItem.deliverySlot || '',
      deliveryDate: firstItem.deliveryDate || ''
    };
  };

  const providerInfo = getProviderInfo();
  const deliveryInfo = getDeliveryInfo();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Set default delivery date to tomorrow if not available in cart
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format cart's delivery date if it's in ISO format
    let formattedDeliveryDate = deliveryInfo?.deliveryDate || '';
    if (formattedDeliveryDate && formattedDeliveryDate.includes('T')) {
      formattedDeliveryDate = formattedDeliveryDate.split('T')[0];
    }
    
    setCheckoutDetails(prev => ({
      ...prev,
      deliveryDate: formattedDeliveryDate || tomorrow.toISOString().split('T')[0],
      deliveryTime: deliveryInfo?.deliverySlot || "Afternoon (12:00 PM - 2:00 PM)"
    }));
  }, [deliveryInfo]);

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
    return 5.99;
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
      
      // Log the full response for debugging
      console.log('API Response (Full):', JSON.stringify(response, null, 2));
      
      // Get the checkout URL from the response
      let checkoutUrl = null;
      
      // Try different paths in the response object to find the checkout URL
      if (response.data?.checkoutUrl) {
        checkoutUrl = response.data.checkoutUrl;
      } else if (response.data?.data?.checkoutUrl) {
        checkoutUrl = response.data.data.checkoutUrl;
      } else if (response.checkoutUrl) {
        checkoutUrl = response.checkoutUrl;
      }
      
      if (checkoutUrl) {
        // Show success message before redirecting
        toast.success('Order created successfully! Redirecting to payment...');
        console.log('Redirecting to checkout URL:', checkoutUrl);
        
        // IMPORTANT: Add a small delay to ensure toast is visible before redirecting
        setTimeout(() => {
          // Redirect directly to the checkout URL without clearing the cart first
          // This prevents seeing an empty cart page
          window.location.href = checkoutUrl;
          
          // The cart will be cleared when the user returns from payment
          // We don't need to call dispatch(clearCart()) here
        }, 1500);
      } else {
        console.error('Could not find checkout URL in response');
        toast.error('Checkout URL not found in response');
        
        // Only clear cart if we're not redirecting
        dispatch(clearCart());
      }
    } catch (error) {
      console.error('Error creating order:', error);
      
      // Try to extract detailed error information
      if (error && typeof error === 'object') {
        console.log('Error details:', JSON.stringify(error, null, 2));
      }
      
      toast.error('Error creating order - check console for details');
    }
  };

  // Show a loading state until client-side rendering is ready
  if (!isClient) {
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
            <div className="lg:col-span-2">
              {providerInfo && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Restaurant Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-2">
                      <Store className="h-5 w-5 text-red-500" />
                      <span className="font-medium">{providerInfo.name}</span>
                    </div>
                    {providerInfo.email && (
                      <div className="text-sm text-gray-500 ml-8">
                        {providerInfo.email}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                        Full Name *
                      </label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={checkoutDetails.fullName}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className={errors.fullName ? "border-red-500" : ""}
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                          Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={checkoutDetails.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-1">
                          Phone Number *
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          value={checkoutDetails.phone}
                          onChange={handleInputChange}
                          placeholder="Your phone number"
                          className={errors.phone ? "border-red-500" : ""}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="deliveryAddress" className="block text-sm font-medium mb-1">
                        Delivery Address *
                      </label>
                      <Textarea
                        id="deliveryAddress"
                        name="deliveryAddress"
                        value={checkoutDetails.deliveryAddress}
                        onChange={handleInputChange}
                        placeholder="Your street address"
                        className={errors.deliveryAddress ? "border-red-500" : ""}
                      />
                      {errors.deliveryAddress && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium mb-1">
                          City *
                        </label>
                        <Input
                          id="city"
                          name="city"
                          value={checkoutDetails.city}
                          onChange={handleInputChange}
                          placeholder="Your city"
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="zipcode" className="block text-sm font-medium mb-1">
                          Zipcode *
                        </label>
                        <Input
                          id="zipcode"
                          name="zipcode"
                          value={checkoutDetails.zipcode}
                          onChange={handleInputChange}
                          placeholder="Your zipcode"
                          className={errors.zipcode ? "border-red-500" : ""}
                        />
                        {errors.zipcode && <p className="text-red-500 text-sm mt-1">{errors.zipcode}</p>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="deliveryDate" className="block text-sm font-medium mb-1">
                          Delivery Date *
                        </label>
                        <Input
                          id="deliveryDate"
                          name="deliveryDate"
                          type="date"
                          value={checkoutDetails.deliveryDate}
                          onChange={handleInputChange}
                          disabled={deliveryInfo?.deliveryDate !== undefined && deliveryInfo?.deliveryDate !== ''}
                          className={errors.deliveryDate ? "border-red-500" : ""}
                        />
                        {errors.deliveryDate && <p className="text-red-500 text-sm mt-1">{errors.deliveryDate}</p>}
                        {deliveryInfo?.deliveryDate && (
                          <p className="text-xs text-gray-500 mt-1">Delivery date set from your cart</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="deliveryTime" className="block text-sm font-medium mb-1">
                          Delivery Time *
                        </label>
                        <Input
                          id="deliveryTime"
                          name="deliveryTime"
                          value={checkoutDetails.deliveryTime}
                          onChange={handleInputChange}
                          disabled={deliveryInfo?.deliverySlot !== undefined && deliveryInfo?.deliverySlot !== ''}
                          className={errors.deliveryTime ? "border-red-500" : ""}
                        />
                        {errors.deliveryTime && <p className="text-red-500 text-sm mt-1">{errors.deliveryTime}</p>}
                        {deliveryInfo?.deliverySlot && (
                          <p className="text-xs text-gray-500 mt-1">Delivery time set from your cart</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="credit-card"
                        name="paymentMethod"
                        value="credit-card"
                        checked={checkoutDetails.paymentMethod === 'credit-card'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-red-500"
                      />
                      <label htmlFor="credit-card" className="text-sm font-medium">
                        Credit / Debit Card
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="cash"
                        name="paymentMethod"
                        value="cash"
                        checked={checkoutDetails.paymentMethod === 'cash'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-red-500"
                      />
                      <label htmlFor="cash" className="text-sm font-medium">
                        Cash on Delivery
                      </label>
                    </div>
                    
                    {checkoutDetails.paymentMethod === 'credit-card' && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-md">
                        <p className="text-center text-sm">
                          Payment processing will be handled securely at the next step
                        </p>
                      </div>
                    )}
                  </div>
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
                              <span className="font-medium mr-2">{item.quantity}x</span>
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
                      
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                      
                      <Button 
                        onClick={handlePlaceOrder}
                        className="w-full bg-red-500 hover:bg-red-600 text-white mt-4"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Place Order
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-2"
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