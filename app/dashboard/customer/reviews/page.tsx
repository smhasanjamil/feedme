"use client";

import { useGetUserOrdersQuery, useSubmitRatingMutation } from "@/redux/features/orders/order";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star, CalendarIcon } from "lucide-react";
import Image from "next/image";
import RatingComponent from "@/components/RatingComponent";
import toast from "react-hot-toast";

export default function ReviewsPage() {
  const { data: orders, isLoading, isError } = useGetUserOrdersQuery();
  const [submitRating] = useSubmitRatingMutation();
  const [mounted, setMounted] = useState(false);

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
      
      toast.success("Rating submitted successfully!");
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to submit rating:", error);
      toast.error("Failed to submit rating. Please try again.");
      return Promise.reject(error);
    }
  };

  // Filter for completed/delivered orders only
  const completedOrders = orders?.filter(order => 
    order.status === "Delivered" || order.status === "Completed"
  ) || [];

  if (!mounted || isLoading) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-bold">Reviews & Ratings</h1>
        <p className="text-xs text-gray-500">
          Rate your meals from completed orders and share your experience.
        </p>
        <div className="mt-3 h-32 animate-pulse rounded-md bg-gray-100"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-bold">Reviews & Ratings</h1>
        <p className="text-xs text-gray-500">
          Rate your meals from completed orders and share your experience.
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
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Reviews & Ratings</h1>
        <p className="text-xs text-gray-500">
          Rate your meals from completed orders and share your experience.
        </p>
      </div>

      {completedOrders.length > 0 ? (
        <div className="space-y-4">
          {completedOrders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] px-2 py-0">
                      Order #{order.trackingNumber}
                    </Badge>
                    <CalendarIcon className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Badge variant="success" className="text-[10px] px-2 py-0">
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-2">Rate Your Meals</h3>
                  {order.meals && order.meals.length > 0 ? (
                    <div className="space-y-4">
                      {order.meals.map((meal, index) => (
                        <div key={meal._id || index} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 overflow-hidden rounded-md">
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
                            <div>
                              <p className="font-medium text-sm">
                                {meal?.mealId?.name}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <span>Qty: {meal?.quantity}</span>
                                <span>•</span>
                                <span>${meal?.price?.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          <RatingComponent 
                            orderId={order._id}
                            mealId={meal.mealId._id}
                            mealName={meal.mealId.name}
                            onRatingSubmit={handleRatingSubmit}
                            isDelivered={true}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No items in this order</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Star className="h-10 w-10 text-gray-300 mb-2" />
            <h3 className="text-sm font-medium">No completed orders found</h3>
            <p className="text-center text-xs text-gray-500 mt-1">
              Your completed orders will appear here for rating once they are delivered.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 