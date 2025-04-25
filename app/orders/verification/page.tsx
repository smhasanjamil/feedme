"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useVerifyOrderQuery } from "@/redux/features/orders/order";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { toast } from "react-hot-toast";
import { useAppDispatch } from "@/redux/hooks";
import { clearCart } from "@/redux/features/cart/cartSlice";

interface OrderData {
  id: string;
  order_id: string;
  tracking_number: string;
  transaction_id: string;
  currency: string;
  amount: number;
  payable_amount: number;
  discount_amount: number;
  disc_percent: number;
  received_amount: number;
  usd_amt: number;
  usd_rate: number;
  transaction_status: string;
  method: string;
  sp_message: string;
  sp_code: string;
  bank_status: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  date_time: string;
  value1: string | null;
  value2: string | null;
  value3: string | null;
  value4: string | null;
}

// Loading component for Suspense
function OrderVerificationLoading() {
  return (
    <div className="container mx-auto p-4 my-10">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-64 rounded bg-gray-200"></div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="mb-4 h-6 w-40 rounded bg-gray-200"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex justify-between">
                    <div className="h-4 w-24 rounded bg-gray-200"></div>
                    <div className="h-4 w-32 rounded bg-gray-200"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main component that uses useSearchParams
function OrderVerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const orderId = searchParams.get("order_id");

  const { isLoading, data } = useVerifyOrderQuery(
    orderId,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Show toast notification when component mounts and clear cart
  useEffect(() => {
    // Clear the cart immediately after successful payment verification
    dispatch(clearCart());
    
    toast.success("Please check your email for order confirmation details", {
      duration: 5000,
      position: "top-center",
      icon: "📧",
    });
    
    console.log("==== COMPONENT MOUNTED ====");
    console.log("API Response:", data);
    console.log("Cart cleared after payment verification");
  }, [dispatch, data]); // Add data to dependencies

  const orderData: OrderData = data?.data?.[0];
  
  // Create a delivery date (7 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  
  // Use the tracking number from the API response
  const trackingNumber = orderData?.tracking_number || 
    (orderData?.order_id ? `TRK-${orderData.order_id.substring(0, 8)}` : "Not available");

  // Ensure we have default values for missing fields
  const paymentMethod = orderData?.method || "Visa/Mastercard/Other Card";
  const transactionStatus = orderData?.transaction_status || "";
  const phoneNumber = orderData?.phone || "";

  return isLoading ? (
    <OrderVerificationLoading />
  ) : (
    <div className="container mx-auto p-2 sm:p-4 my-6 sm:my-10">
      <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold">Order Verification</h1>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <dl className="grid grid-cols-2 gap-2">
              <dt className="font-semibold">Order ID:</dt>
              <dd className="break-all">{orderData?.id}</dd>
              <dt className="font-semibold">Amount:</dt>
              <dd>
                {orderData?.currency} {orderData?.amount?.toFixed(2)}
              </dd>
              <dt className="font-semibold">Status:</dt>
              <dd>
                <Badge
                  variant={
                    orderData?.bank_status === "Success"
                      ? "default"
                      : "destructive"
                  }
                >
                  {orderData?.bank_status}
                </Badge>
              </dd>
              <dt className="font-semibold">Order Date:</dt>
              <dd className="break-all">{new Date(orderData?.date_time)?.toLocaleString()}</dd>
             
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <dl className="grid grid-cols-2 gap-2">
              <dt className="font-semibold">Method:</dt>
              <dd className="break-all">{paymentMethod}</dd>
              <dt className="font-semibold">Transacion Status:</dt>
              <dd className="break-all">{transactionStatus}</dd>
              <dt className="font-semibold">Invoice No:</dt>
              <dd className="break-all">{orderData?.order_id}</dd>
              <dt className="font-semibold">SP Code:</dt>
              <dd className="break-all">{orderData?.sp_code}</dd>
              <dt className="font-semibold">SP Message:</dt>
              <dd className="break-all">{orderData?.sp_message}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <dl className="grid grid-cols-2 gap-2">
              <dt className="font-semibold">Name:</dt>
              <dd className="break-all">{orderData?.name}</dd>
              <dt className="font-semibold">Email:</dt>
              <dd className="break-all">{orderData?.email}</dd>
              <dt className="font-semibold">Phone:</dt>
              <dd className="break-all">{phoneNumber}</dd>
              <dt className="font-semibold">Address:</dt>
              <dd className="break-all">{orderData?.address}</dd>
              <dt className="font-semibold">City:</dt>
              <dd className="break-all">{orderData?.city}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Track your Order</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <dl className="mb-4 grid grid-cols-2 gap-2">
              <dt className="font-semibold">Tracking Number:</dt>
              <dd className="break-all">{trackingNumber}</dd>
            </dl>
            <div className="flex items-center gap-2">
              {orderData?.bank_status === "Success" ? (
                <>
                  <CheckCircle className="text-green-500" />
                  <span>Verified</span>
                </>
              ) : (
                <>
                  <AlertCircle className="text-yellow-500" />
                  <span>Not Verified</span>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 sm:p-6">
            <Button className="w-full" onClick={() => router.push('/dashboard/customer/my-orders')}>Track Order</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Export the wrapped component with Suspense boundary
export default function OrderVerification() {
  return (
    <Suspense fallback={<OrderVerificationLoading />}>
      <OrderVerificationContent />
    </Suspense>
  );
}