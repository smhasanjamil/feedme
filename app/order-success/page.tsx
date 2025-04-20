'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Calendar, Clock, MapPin, Utensils, DollarSign, Store, User, Mail, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { clearCart } from '@/redux/features/cart/cartSlice';

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  
  // Get actual values from URL or use placeholders (not hardcoded values)
  const [orderDetails, setOrderDetails] = useState({
    orderId: searchParams.get('orderId') || 'Order ID will be generated',
    mealName: searchParams.get('mealName') || 'Your meal',
    deliveryDate: searchParams.get('deliveryDate') || formatDate(new Date()),
    deliveryTime: searchParams.get('deliveryTime') || 'Delivery time',
    deliveryAddress: searchParams.get('deliveryAddress') || 'Your address',
    subtotal: searchParams.get('subtotal') || '$0.00',
    tax: searchParams.get('tax') || '$0.00',
    shipping: searchParams.get('shipping') || '$0.00',
    total: searchParams.get('total') || 'Total',
    specialInstructions: searchParams.get('specialInstructions') || '',
    status: searchParams.get('status') || 'Processing',
    // Provider info
    providerName: searchParams.get('providerName') || '',
    providerEmail: searchParams.get('providerEmail') || '',
    // Customer info
    customerName: searchParams.get('customerName') || '',
    customerEmail: searchParams.get('customerEmail') || '',
    customerPhone: searchParams.get('customerPhone') || ''
  });

  // Mask sensitive information
  const maskAddress = (address: string | null): string => {
    if (!address || address === 'Your address') return address || 'Your address';
    
    // Split by commas or lines and mask parts
    const parts = address.split(/,|\n/);
    if (parts.length > 1) {
      // If multiple parts, show only the city and state
      return parts.slice(1).join(',').trim();
    }
    return address;
  };

  const maskEmail = (email: string | null): string => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (!domain) return email;
    
    // Show only first character of local part and the domain
    return `${localPart.charAt(0)}${'*'.repeat(localPart.length - 1)}@${domain}`;
  };

  const maskPhone = (phone: string | null): string => {
    if (!phone) return '';
    
    // Show only last 4 digits
    return `***-***-${phone.slice(-4)}`;
  };

  useEffect(() => {
    // Clear the cart after successful order
    dispatch(clearCart());
    
    // In a real app, we would fetch the order details from the API
    // For now, just format and mask data from URL params
    setOrderDetails(prev => ({
      ...prev,
      deliveryAddress: maskAddress(prev.deliveryAddress),
      customerEmail: maskEmail(prev.customerEmail),
      customerPhone: maskPhone(prev.customerPhone)
    }));
  }, [searchParams, dispatch]);

  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-2">
            Thank you for your order. We&apos;ve received your request and it&apos;s being processed.
          </p>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            {orderDetails.status}
          </Badge>
        </div>

        <Card className="mb-8 overflow-hidden border-0 shadow-md">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white">
            <h2 className="text-xl font-semibold">Order Summary</h2>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Order #</span>
                </div>
                <span>{orderDetails.orderId}</span>
              </div>
              
              {orderDetails.providerName && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">Restaurant</span>
                  </div>
                  <span>{orderDetails.providerName}</span>
                </div>
              )}
              
              {orderDetails.customerName && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">Customer</span>
                  </div>
                  <span>{orderDetails.customerName}</span>
                </div>
              )}
              
              {orderDetails.customerEmail && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">Email</span>
                  </div>
                  <span>{orderDetails.customerEmail}</span>
                </div>
              )}
              
              {orderDetails.customerPhone && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">Phone</span>
                  </div>
                  <span>{orderDetails.customerPhone}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Delivery Date</span>
                </div>
                <span>{orderDetails.deliveryDate}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Delivery Time</span>
                </div>
                <span>{orderDetails.deliveryTime}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Delivery Address</span>
                </div>
                <span className="text-right">{orderDetails.deliveryAddress}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Subtotal</span>
                </div>
                <span>{orderDetails.subtotal}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Tax (5%)</span>
                </div>
                <span>{orderDetails.tax}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Shipping</span>
                </div>
                <span>{orderDetails.shipping}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Total</span>
                </div>
                <span className="font-bold text-lg">{orderDetails.total}</span>
              </div>

              {orderDetails.specialInstructions && (
                <div className="mt-4 bg-gray-50 p-3 rounded-md">
                  <p className="font-medium mb-1">Special Instructions:</p>
                  <p className="text-gray-600 text-sm">{orderDetails.specialInstructions}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <div className="p-4 bg-blue-50 rounded-md mb-4 text-center">
            <p className="text-blue-700 text-sm">
              We&apos;ll send you a confirmation email and notifications when your meal is prepared and out for delivery.
            </p>
          </div>
          
          <Button 
            onClick={() => router.push('/dashboard/orders')}
            className="w-full mb-3"
          >
            Track Your Order
          </Button>
          
          <Button 
            onClick={() => router.push('/find-meals')}
            variant="outline"
            className="w-full"
          >
            Order More Meals
          </Button>
        </div>
      </div>
    </div>
  );
} 