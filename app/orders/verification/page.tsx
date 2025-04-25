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
import { useEffect } from "react";

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

export default function OrderVerification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");

  const { isLoading, data } = useVerifyOrderQuery(
    orderId,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Add useEffect to ensure logging happens after component mounts
  useEffect(() => {
    console.log("==== COMPONENT MOUNTED ====");
    console.log("API Response:", data);
  }, [data]);

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
    <div className="container mx-auto p-4 my-10">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-64 rounded bg-gray-200"></div>
        <div className="grid gap-6 md:grid-cols-2">
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
  ) : (
    <div className="container mx-auto p-4 my-10">
      <h1 className="mb-6 text-3xl font-bold">Order Verification</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-2">
              <dt className="font-semibold">Order ID:</dt>
              <dd>{orderData?.id}</dd>
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
              <dd>{new Date(orderData?.date_time)?.toLocaleString()}</dd>
             
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-2">
              <dt className="font-semibold">Method:</dt>
              <dd>{paymentMethod}</dd>
              <dt className="font-semibold">Transacion Status:</dt>
              <dd>{transactionStatus}</dd>
              <dt className="font-semibold">Invoice No:</dt>
              <dd>{orderData?.order_id}</dd>
              <dt className="font-semibold">SP Code:</dt>
              <dd>{orderData?.sp_code}</dd>
              <dt className="font-semibold">SP Message:</dt>
              <dd>{orderData?.sp_message}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-2">
              <dt className="font-semibold">Name:</dt>
              <dd>{orderData?.name}</dd>
              <dt className="font-semibold">Email:</dt>
              <dd>{orderData?.email}</dd>
              <dt className="font-semibold">Phone:</dt>
              <dd>{phoneNumber}</dd>
              <dt className="font-semibold">Address:</dt>
              <dd>{orderData?.address}</dd>
              <dt className="font-semibold">City:</dt>
              <dd>{orderData?.city}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Track your Order</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="mb-4 grid grid-cols-2 gap-2">
              <dt className="font-semibold">Tracking Number:</dt>
              <dd>{trackingNumber}</dd>
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
          <CardFooter>
            <Button className="w-full" onClick={() => router.push('/dashboard/my-orders')}>Track Order</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}