"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CustomerDashboard() {
  const router = useRouter();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Customer Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Orders</CardTitle>
            <ShoppingCart className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Orders</div>
            <p className="text-muted-foreground text-xs">
              View your order history and status
            </p>
            <button
              onClick={() => router.push("/dashboard/customer/my-orders")}
              className="bg-primary mt-4 rounded-md px-4 py-2 text-sm text-white"
            >
              View Orders
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Track Order</CardTitle>
            <Search className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Order Tracking</div>
            <p className="text-muted-foreground text-xs">
              Track the status of your current orders
            </p>
            <button
              onClick={() => router.push("/dashboard/customer/track-order")}
              className="bg-primary mt-4 rounded-md px-4 py-2 text-sm text-white"
            >
              Track Order
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Select Meal</CardTitle>
            <ShoppingCart className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Select Meal</div>
            <p className="text-muted-foreground text-xs">Select Your Meals</p>
            <button
              onClick={() => router.push("/find-meals")}
              className="bg-primary mt-4 rounded-md px-4 py-2 text-sm text-white"
            >
              Select Meal
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
