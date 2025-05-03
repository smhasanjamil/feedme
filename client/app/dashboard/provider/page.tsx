"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProviderDashboard() {
  const router = useRouter();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Provider Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Meals</CardTitle>
            <Package2 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Meals</div>
            <p className="text-muted-foreground text-xs">
              Add, edit, and manage your meal offerings
            </p>
            <button
              onClick={() => router.push("/dashboard/provider/manage-meals")}
              className="bg-primary mt-4 rounded-md px-4 py-2 text-sm text-white"
            >
              Manage Meals
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Orders</CardTitle>
            <ShoppingCart className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Orders</div>
            <p className="text-muted-foreground text-xs">
              View and process customer orders
            </p>
            <button
              onClick={() => router.push("/dashboard/provider/manage-orders")}
              className="bg-primary mt-4 rounded-md px-4 py-2 text-sm text-white"
            >
              Manage Orders
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
