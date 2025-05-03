"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Main welcome card skeleton */}
      <Card className="col-span-2 rounded-2xl bg-gradient-to-br from-gray-50 to-white p-6 shadow">
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>

      {/* Health tip card skeleton */}
      <Card className="rounded-2xl bg-gradient-to-br from-gray-50 to-white p-4 shadow">
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
