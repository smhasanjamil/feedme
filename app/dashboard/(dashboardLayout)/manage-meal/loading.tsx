"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManageMealLoading() {
  // Create an array of 6 items to display a grid of skeleton cards
  const skeletonItems = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="p-6">
      <Skeleton className="mb-6 h-8 w-48" />

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {skeletonItems.map((index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative">
              <Skeleton className="h-48 w-full" />
            </div>
            <CardHeader className="p-4">
              <Skeleton className="mb-2 h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-0">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <div className="mt-2 flex items-center justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 p-4 pt-0">
              <Skeleton className="h-9 w-16 rounded-md" />
              <Skeleton className="h-9 w-16 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
