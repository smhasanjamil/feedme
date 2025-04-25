import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { use } from "react";

import Link from "next/link";

interface OrderPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default function OrderPage({ params }: OrderPageProps) {
  const { orderId } = use(params);

  // Normally you would fetch this data from an API
  const orderData = {
    id: orderId,
    amount: "BDT 5095000.00",
    status: "Success",
    date: "4/24/2023, 3:17:43 AM",
    estimatedDelivery: "May 1, 2023",
    payment: {
      method: "Nagad",
      transactionId: "68095817",
      invoiceNo: orderId,
      spCode: "1000",
      spMessage: "Success",
    },
    customer: {
      name: "Jabed Restro",
      email: "j1111@gmail.com",
      phone: "01729488432",
      address: "Badurtola,cumilla",
      city: "Cumilla",
    },
    tracking: {
      number: `TRK-${orderId.substring(0, 8)}`,
      estimatedDelivery: "May 1, 2023",
      daysRemaining: 7,
      verified: true,
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <Link href="/orders/verification">
          <Button variant="outline">Back to Verification</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Order Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-medium">{orderData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">{orderData.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge className="bg-green-500">{orderData.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{orderData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-500">Estimated Delivery:</span>
                <span className="font-medium text-red-500">
                  {orderData.estimatedDelivery}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method:</span>
                <span className="font-medium">{orderData.payment.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-medium">
                  {orderData.payment.transactionId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoice No:</span>
                <span className="font-medium">
                  {orderData.payment.invoiceNo}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SP Code:</span>
                <span className="font-medium">{orderData.payment.spCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SP Message:</span>
                <span className="font-medium">
                  {orderData.payment.spMessage}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{orderData.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{orderData.customer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{orderData.customer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Address:</span>
                <span className="font-medium">
                  {orderData.customer.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">City:</span>
                <span className="font-medium">{orderData.customer.city}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Track your Order Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Track your Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tracking Number:</span>
                <span className="font-medium">{orderData.tracking.number}</span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                {orderData.tracking.verified && (
                  <>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="font-medium">Verified</span>
                  </>
                )}
              </div>
              <Button className="mt-4 w-full bg-black text-white hover:bg-gray-800">
                Track Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
