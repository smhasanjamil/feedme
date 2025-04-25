"use client";

import { useGetUserOrdersQuery, useSubmitRatingMutation } from "@/redux/features/orders/order";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, CalendarIcon } from "lucide-react";
import Image from "next/image";
import RatingComponent from "@/components/RatingComponent";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function MyOrdersPage() {
  const { data: orders, isLoading, isError } = useGetUserOrdersQuery();
  const [submitRating] = useSubmitRatingMutation();
  const [mounted, setMounted] = useState(false);
  const [testOrders, setTestOrders] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRatingSubmit = async (rating: number, comment: string, mealId: string, orderId: string) => {
    try {
      await submitRating({
        rating,
        comment,
        mealId,
        orderId,
      }).unwrap();
      
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to submit rating:", error);
      return Promise.reject(error);
    }
  };

  // Function to toggle order status for testing
  const toggleDeliveredStatus = (orderId: string) => {
    setTestOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
    toast.success("Order status toggled for testing");
  };

  // Function to check if order should be treated as delivered
  const isOrderDelivered = (order: any) => {
    return order.status === "Delivered" || testOrders[order._id] === true;
  };

  if (!mounted || isLoading) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-bold">My Orders</h1>
        <p className="text-xs text-gray-500">
          Track your order status using tracking number from track order status page. View order status and delivery details.
        </p>
        <div className="mt-3 h-32 animate-pulse rounded-md bg-gray-100"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-bold">My Orders</h1>
        <p className="text-xs text-gray-500">
          Track your order status using tracking number from track order status page. View order status and delivery details.
        </p>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 text-red-600">
              <p className="text-sm">There was an error fetching your orders. Please try again later.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">My Orders</h1>
      <p className="text-xs text-gray-500">
        Track your order status using tracking number from track order status page. View order status and delivery details.
      </p>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden border">
              {/* Header with tracking number and status */}
              <div className="flex items-center justify-between bg-gray-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Tracking Number:</span>
                  <span className="text-xs text-blue-600">{order.trackingNumber}</span>
                  <CalendarIcon className="ml-1 h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      order.status === "Delivered" || testOrders[order._id]
                        ? "success"
                        : order.status === "Processing"
                        ? "outline"
                        : order.status === "Paid"
                        ? "default"
                        : "secondary"
                    }
                    className="text-[10px] px-2 py-0"
                  >
                    {testOrders[order._id] ? "Delivered (Test)" : order.status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-[10px] h-6"
                    onClick={() => toggleDeliveredStatus(order._id)}
                  >
                    {testOrders[order._id] ? "Set Not Delivered" : "Set Delivered"}
                  </Button>
                </div>
              </div>

              {/* Content in 3-column grid */}
              <div className="grid grid-cols-3 divide-x divide-gray-100">
                {/* Customer column */}
                <div className="p-3">
                  <h3 className="mb-1 text-xs font-medium">Customer</h3>
                  <div className="space-y-0.5 text-[10px]">
                    <p className="font-medium">{order.name || "Customer Name"}</p>
                    <p>{order.email || "Email"}</p>
                    <p>{order.phone || "Phone"}</p>
                    <p>{order.address || "Address"}</p>
                  </div>
                </div>

                {/* Products column */}
                <div className="p-3">
                  <h3 className="mb-1 text-xs font-medium">Products ({order.meals?.length || 0})</h3>
                  {order.meals && order.meals.length > 0 ? (
                    <div className="space-y-2">
                      {order.meals.map((meal, index) => (
                        <div key={meal._id || index} className="flex items-center gap-2 py-1">
                          <div className="relative h-8 w-8 overflow-hidden rounded-sm border">
                            {meal?.mealId?.image ? (
                              <Image
                                src={meal.mealId.image}
                                alt={meal.mealId.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                <ShoppingBag className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] font-medium">
                              {meal?.mealId?.name}
                            </p>
                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                              <span>Qty: {meal?.quantity}</span>
                              <span>•</span>
                              <span>${meal?.price?.toFixed(2)}</span>
                            </div>
                          </div>
                          <div>
                            <RatingComponent 
                              orderId={order._id}
                              mealId={meal.mealId._id}
                              mealName={meal.mealId.name}
                              onRatingSubmit={handleRatingSubmit}
                              isDelivered={isOrderDelivered(order)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-500">No items in this order</p>
                  )}
                  <div className="mt-2 text-[10px]">
                    <p>Est. Delivery: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}</p>
                    <p>Status: {isOrderDelivered(order) ? "Delivered" : order.status}</p>
                  </div>
                </div>

                {/* Payment column */}
                <div className="p-3">
                  <h3 className="mb-1 text-xs font-medium">Payment</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span>Subtotal</span>
                      <span className="font-medium">${order.subtotal?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span>Tax + Ship</span>
                      <span className="font-medium">
                        ${(Number(order.tax || 0) + Number(order.shipping || 0)).toFixed(2)}
                      </span>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between text-xs font-medium">
                      <span>Total:</span>
                      <span>${order.totalPrice?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-3">
            <ShoppingBag className="h-6 w-6 text-gray-300" />
            <h3 className="mt-1 text-sm font-medium">No orders found</h3>
            <p className="text-center text-[10px] text-gray-500">
              You haven&apos;t placed any orders yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 