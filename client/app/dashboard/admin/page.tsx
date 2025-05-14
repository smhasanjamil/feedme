"use client";

import { TotalUsers } from "@/components/charts/TotalUsers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div>
      <h1 className="text-feed-jungle mb-6 text-2xl font-bold">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Users</CardTitle>
            <Users className="text-feed-jungle h-4 w-4" />
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-feed-jungle text-2xl font-bold">Users</div>
            <p className="text-muted-foreground text-xs">
              Manage users, roles and permissions
            </p>
            <button
              onClick={() => router.push("/dashboard/admin/manage-users")}
              className="border-feed-jungle text-feed-jungle bg-feed-lime hover:bg-feed-jungle hover:text-feed-lime mt-4 rounded-full border-2 px-4 py-2 text-sm"
            >
              Manage Users
            </button>
          </CardContent>
        </Card>
        <TotalUsers/>
      </div>
    </div>
  );
}
