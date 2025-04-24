"use client";

import { useGetUserOrdersQuery } from "@/redux/features/orders/order";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, CalendarIcon } from "lucide-react";
import Image from "next/image";

export default function MyOrdersPage() {
  const { data: orders, isLoading, isError } = useGetUserOrdersQuery();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
                <Badge
                  variant={
                    order.status === "Delivered"
                      ? "success"
                      : order.status === "Processing"
                      ? "outline"
                      : order.status === "Paid"
                      ? "default"
                      : "secondary"
                  }
                  className="text-[10px] px-2 py-0"
                >
                  {order.status}
                </Badge>
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
                    <div className="flex items-center gap-2 py-1">
                      <div className="relative h-8 w-8 overflow-hidden rounded-sm border">
                        {order.meals[0]?.mealId?.image ? (
                          <Image
                            src={order.meals[0].mealId.image}
                            alt={order.meals[0].mealId.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100">
                            <ShoppingBag className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-medium">
                          {order.meals[0]?.mealId?.name}
                          {order.meals.length > 1 ? ` + ${order.meals.length - 1} more` : ''}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <span>Qty: {order.meals[0]?.quantity}</span>
                          <span>•</span>
                          <span>${order.meals[0]?.price?.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-500">No items in this order</p>
                  )}
                  <div className="mt-2 text-[10px]">
                    <p>Est. Delivery: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}</p>
                    <p>Status: {order.status}</p>
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