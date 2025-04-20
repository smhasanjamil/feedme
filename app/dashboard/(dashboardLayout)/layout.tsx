import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/shared/DashboardSidebar";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
    <DashboardSidebar />
    <SidebarInset>
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
        <SidebarTrigger />
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Dashboard</h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      {children}
      </main>
    </SidebarInset>
  </SidebarProvider>
  );
}
