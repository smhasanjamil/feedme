"use client";
import {
  Package2,
  ShoppingCart,
  LogOut,
  LayoutDashboard,
  User,
  ListOrderedIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

const providerMenuItems = [
  { name: "Dashboard", path: "/dashboard/provider", icon: <LayoutDashboard /> },
  {
    name: "Manage Meals",
    path: "/dashboard/provider/manage-meals",
    icon: <Package2 />,
  },
  {
    name: "Manage Orders",
    path: "/dashboard/provider/manage-orders",
    icon: <ListOrderedIcon />,
  },
  { name: "Profile", path: "/dashboard/provider/profile", icon: <User /> },
];

export default function ProviderSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-[60px] items-center px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Feedme - Provider</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {providerMenuItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild size={"lg"} key={index}>
                <Link
                  href={item.path}
                  key={index}
                  className="flex items-center gap-2 rounded-md p-2 text-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <span className="text-gray-500">{item.icon}</span>
                  <span className="font-bold">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="w-full text-left text-red-500 hover:text-red-600">
                <LogOut className="h-4 w-4" />
                <span className="font-bold">Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
} 