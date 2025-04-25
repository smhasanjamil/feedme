"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Users</div>
            <p className="text-xs text-muted-foreground">
              Manage users, roles and permissions
            </p>
            <button 
              onClick={() => router.push("/dashboard/admin/manage-users")}
              className="mt-4 bg-primary text-white px-4 py-2 rounded-md text-sm"
            >
              Manage Users
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 