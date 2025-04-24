import { Card, CardContent } from "@/components/ui/card";

export default function ManageOrdersLoading() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Orders Management</h1>
        <p className="text-xs text-gray-500">
          Manage order statuses and estimated delivery dates.
        </p>
      </div>

      {/* Order Statistics Skeleton */}
      <div className="grid grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
              <div className="mt-2 h-8 w-12 animate-pulse rounded bg-gray-200"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search Skeleton */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
            <div className="h-3 w-48 animate-pulse rounded bg-gray-200"></div>
            <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table Skeleton */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
          <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
        </div>

        <div className="rounded-md border">
          <div className="grid grid-cols-6 gap-4 bg-gray-50 p-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-gray-200"></div>
            ))}
          </div>

          {/* Order Rows */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 border-t border-gray-100 p-3">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="h-8 animate-pulse rounded bg-gray-200"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 