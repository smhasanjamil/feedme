"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";

export default function Dashboard() {
  const user = useAppSelector(currentUser);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Redirect to role-specific dashboard
    switch (user.role) {
      case "admin":
        router.push("/dashboard/admin");
        break;
      case "provider":
        router.push("/dashboard/provider");
        break;
      default:
        router.push("/dashboard/customer");
        break;
    }
  }, [user, router]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4 p-8">
      <Skeleton className="h-12 w-3/4 max-w-md" />
      <Skeleton className="h-24 w-3/4 max-w-md" />
      <Skeleton className="h-32 w-3/4 max-w-md" />
    </div>
  );
}
