"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
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
    <div className="flex justify-center items-center h-full">
      Redirecting to your dashboard...
    </div>
  );
} 