"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CustomerDashboard() {
  const router = useRouter();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Orders</div>
            <p className="text-xs text-muted-foreground">
              View your order history and status
            </p>
            <button 
              onClick={() => router.push("/dashboard/customer/my-orders")}
              className="mt-4 bg-primary text-white px-4 py-2 rounded-md text-sm"
            >
              View Orders
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Track Order</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Order Tracking</div>
            <p className="text-xs text-muted-foreground">
              Track the status of your current orders
            </p>
            <button 
              onClick={() => router.push("/dashboard/customer/track-order")}
              className="mt-4 bg-primary text-white px-4 py-2 rounded-md text-sm"
            >
              Track Order
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 