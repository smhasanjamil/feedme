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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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

        <div className="overflow-x-auto rounded-md border">
          <table className="w-full min-w-full">
            <thead>
              <tr className="bg-gray-50 text-xs font-medium text-gray-500">
                {[...Array(8)].map((_, i) => (
                  <th key={i} className="px-3 py-3">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-t border-gray-100">
                  {[...Array(8)].map((_, j) => (
                    <td key={j} className="px-3 py-3">
                      <div className="h-8 w-full animate-pulse rounded bg-gray-200"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 