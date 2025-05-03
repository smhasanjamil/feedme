"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Users</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Users</div>
            <p className="text-muted-foreground text-xs">
              Manage users, roles and permissions
            </p>
            <button
              onClick={() => router.push("/dashboard/admin/manage-users")}
              className="bg-primary mt-4 rounded-md px-4 py-2 text-sm text-white"
            >
              Manage Users
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
