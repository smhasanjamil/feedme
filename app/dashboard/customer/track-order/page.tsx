"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, User, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackOrder } from "@/app/services/orderService";

// Order tracking status steps
const orderStatusSteps = [
  { id: "placed", label: "Placed", icon: CheckCircle2 },
  { id: "approved", label: "Approved", icon: CheckCircle2 },
  { id: "processed", label: "Processed", icon: CheckCircle2 },
  { id: "shipped", label: "Shipped", icon: CheckCircle2 },
  { id: "delivered", label: "Delivered", icon: CheckCircle2 },
];

// Interface for order tracking data
interface OrderTrackingData {
  trackingNumber: string;
  estimatedDelivery?: string;
  deliveryDate: string;
  deliverySlot: string;
  status: string;
  currentLocation?: string;
  facility?: string;
  placedDate?: string;
  lastUpdated?: string;
  trackingStages?: {
    placed: boolean;
    approved: boolean;
    processed: boolean;
    shipped: boolean;
    delivered: boolean;
  };
  transaction?: {
    id: string;
    transactionStatus: string;
  };
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  subtotal: number;
  tax: number;
  shipping: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export default function TrackOrderPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderData, setOrderData] = useState<OrderTrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrackOrder = async () => {
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call the tracking service
      const response = await trackOrder(trackingNumber);

      if (response && response.status) {
        setOrderData(response.data);
      } else {
        setError("Order not found. Please check your tracking number.");
      }
    } catch (err) {
      setError("Failed to track order. Please try again later.");
      console.error("Error tracking order:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format date for better display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-4 text-2xl font-bold">Track Your Order</h1>
      <p className="mb-6 text-gray-600">
        Enter your tracking number to check the status of your order.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Order Tracking</CardTitle>
          <p className="text-sm text-gray-500">
            Find your order by entering your tracking number (make sure no space
            in front of your tracking number)
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="TRK-m9un8zx5-EX0MO"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleTrackOrder} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </CardContent>
      </Card>

      {orderData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Order Details</CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-600">
                Active
              </Badge>
            </div>
            <div className="text-sm text-gray-500">
              <p>Tracking Number: {orderData.trackingNumber}</p>
              <p>Estimated Delivery: {formatDate(orderData.deliveryDate)}</p>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tracking" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="tracking">Tracking</TabsTrigger>
                <TabsTrigger value="details">Order Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
              </TabsList>

              <TabsContent value="tracking">
                {/* Order Status Timeline */}
                <div className="mb-6">
                  <div className="relative mb-8 flex justify-between">
                    <div className="absolute top-1/4 right-0 left-0 -z-10 h-1 bg-gray-200"></div>
                    {orderStatusSteps.map((step, index) => {
                      // Use trackingStages if available, otherwise fallback to previous logic
                      const isCompleted = orderData.trackingStages
                        ? orderData.trackingStages[
                            step.id as keyof typeof orderData.trackingStages
                          ]
                        : (orderData.status === "placed" && index === 0) ||
                          (orderData.status === "approved" && index <= 1) ||
                          (orderData.status === "processed" && index <= 2) ||
                          (orderData.status === "shipped" && index <= 3) ||
                          (orderData.status === "delivered" && index <= 4);

                      // Active is the current stage
                      const isActive = orderData.trackingStages
                        ? orderData.trackingStages[
                            step.id as keyof typeof orderData.trackingStages
                          ] &&
                          (index === 0 ||
                            !orderData.trackingStages[
                              orderStatusSteps[index + 1]
                                ?.id as keyof typeof orderData.trackingStages
                            ])
                        : orderData.status === step.id;

                      return (
                        <div
                          key={step.id}
                          className="flex flex-col items-center"
                        >
                          <div
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full",
                              isCompleted
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-500",
                            )}
                          >
                            <step.icon className="h-5 w-5" />
                          </div>
                          <span
                            className={cn(
                              "mt-2 text-sm",
                              isActive ? "font-bold" : "",
                              isCompleted ? "text-green-600" : "text-gray-500",
                            )}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="mb-4 rounded-lg border bg-blue-50 p-4">
                  <div className="mb-2 flex items-start">
                    <Clock className="mt-0.5 mr-2 h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-blue-800">
                        Estimated Delivery Date
                      </h3>
                      <p className="text-blue-700">
                        Your order is expected to be delivered on:
                      </p>
                      <p className="font-bold text-blue-900">
                        {formatDate(orderData.deliveryDate)}
                      </p>
                      <p className="text-blue-700">
                        Delivery Slot: {orderData.deliverySlot}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 font-medium">Current Location</h3>
                    <p className="text-gray-600">
                      {orderData.currentLocation ||
                        orderData.city ||
                        "Processing"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {orderData.facility || "Processing facility"}
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="mb-1 font-medium">ORDER TRACKING</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">Placed</p>
                        <p className="font-medium">
                          {formatDate(orderData.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Order last updated
                        </p>
                        <p className="font-medium">
                          {formatDate(orderData.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details">
                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">Order Information</h3>
                  <p className="text-gray-600">
                    Tracking Number: {orderData.trackingNumber}
                  </p>
                  <p className="text-gray-600">
                    Current Status: {orderData.status}
                  </p>
                  <p className="text-gray-600">
                    Estimated Delivery: {formatDate(orderData.deliveryDate)}
                  </p>
                  <p className="text-gray-600">
                    Delivery Slot: {orderData.deliverySlot}
                  </p>

                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700">Order Summary</h4>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${orderData.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>${orderData.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>${orderData.shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${orderData.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="shipping">
                <div className="space-y-6">
                  {/* Shipping Address Section */}
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-3 font-medium">Shipping Address</h3>
                    <p className="font-medium text-gray-800">
                      {orderData.name}
                    </p>
                    <p className="text-gray-600">{orderData.address}</p>
                    <p className="text-gray-600">
                      {orderData.city}, {orderData.zipCode}
                    </p>
                  </div>

                  {/* Delivery Information */}
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-3 font-medium">Delivery Information</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-[120px_1fr] gap-2">
                        <p className="text-gray-500">Delivery Date:</p>
                        <p className="text-gray-800">
                          {formatDate(orderData.deliveryDate)}
                        </p>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-2">
                        <p className="text-gray-500">Delivery Slot:</p>
                        <p className="text-gray-800">
                          {orderData.deliverySlot}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-3 font-medium">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-800">{orderData.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-800">{orderData.phone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-800">{orderData.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  {orderData.transaction && (
                    <div className="rounded-lg border p-4">
                      <h3 className="mb-3 font-medium">Payment Information</h3>
                      <div className="space-y-2">
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                          <p className="text-gray-500">Transaction ID:</p>
                          <p className="text-gray-800">
                            {orderData.transaction.id}
                          </p>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                          <p className="text-gray-500">Status:</p>
                          <p className="text-gray-800">
                            {orderData.transaction.transactionStatus}
                          </p>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                          <p className="text-gray-500">Date & Time:</p>
                          <p className="text-gray-800">
                            {formatDate(orderData.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
