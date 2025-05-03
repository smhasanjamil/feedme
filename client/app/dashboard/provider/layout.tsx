"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ProviderSidebar from "../admin/components/ProviderSidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProviderDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true when component mounts on client
    setIsClient(true);

    // Redirect if not logged in or not a provider
    if (!user) {
      router.push("/login");
    } else if (user.role !== "provider") {
      // Redirect to appropriate dashboard based on role
      if (user.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/customer");
      }
    }
  }, [user, router]);

  // Return the same sidebar structure for both server and initial client render
  // but only show the content when authenticated on the client
  return (
    <SidebarProvider>
      <ProviderSidebar />
      <SidebarInset>
        <header className="bg-muted/40 flex h-14 items-center gap-4 border-b px-6 lg:h-[60px]">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Provider Dashboard</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {isClient && (!user || user.role !== "provider") ? (
            <div className="flex h-48 items-center justify-center">
              Loading...
            </div>
          ) : (
            children
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
