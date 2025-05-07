"use client";
import {
  Package2,
  Users,
  LogOut,
  LayoutDashboard,
  User,
  Home,
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
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const adminMenuItems = [
  { name: "Home", path: "/", icon: <Home /> },
  { name: "Dashboard", path: "/dashboard/admin", icon: <LayoutDashboard /> },
  {
    name: "Manage Users",
    path: "/dashboard/admin/manage-users",
    icon: <Users />,
  },
  { name: "Profile", path: "/dashboard/admin/profile", icon: <User /> },
];

export default function AdminSidebar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    router.push("/login");
    toast.success("Logged out successfully");
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-[60px] items-center text-feed-jungle">
          <Link href="/dashboard/admin" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" color="#2b4717" />
            <span className="text-feed-jungle">Feedme - Admin</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {adminMenuItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild size={"lg"} key={index}>
                <Link
                  href={item.path}
                  key={index}
                  className="flex items-center gap-2 rounded-md p-2 text-lg text-feed-jungle hover:bg-gray-100 hover:text-gray-900"
                >
                  <span  color="#2b4717">{item.icon}</span>
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
              <button
                onClick={handleLogout}
                className="w-full text-left text-feed-jungle"
              >
                <LogOut className="h-4 w-4 " color="#2b4717"  />
                <span className="font-bold text-feed-jungle hover:text-shadow-feed-jungle cursor-pointer">Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
