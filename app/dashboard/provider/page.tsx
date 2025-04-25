"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProviderDashboard() {
  const router = useRouter();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Provider Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Meals</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Meals</div>
            <p className="text-xs text-muted-foreground">
              Add, edit, and manage your meal offerings
            </p>
            <button 
              onClick={() => router.push("/dashboard/provider/manage-meals")}
              className="mt-4 bg-primary text-white px-4 py-2 rounded-md text-sm"
            >
              Manage Meals
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Orders</div>
            <p className="text-xs text-muted-foreground">
              View and process customer orders
            </p>
            <button 
              onClick={() => router.push("/dashboard/provider/manage-orders")}
              className="mt-4 bg-primary text-white px-4 py-2 rounded-md text-sm"
            >
              Manage Orders
            </button>
          </CardContent>
        </Card>

       
      </div>
    </div>
  );
} 