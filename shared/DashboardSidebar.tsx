"use client";
import {
  Package2,
  ShoppingCart,
  Users,
  LogOut,
  LayoutDashboard,
  User,
  ListOrderedIcon,
  Search,
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
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// Menu items for Provider
const providerMenuItems = [
  { name: "Home", path: "/", icon: <Home /> },
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

// Menu items for Customer
const customerMenuItems = [
  { name: "Home", path: "/", icon: <Home /> },
  { name: "Dashboard", path: "/dashboard/customer", icon: <LayoutDashboard /> },
  {
    name: "My Orders",
    path: "/dashboard/customer/my-orders",
    icon: <ShoppingCart />,
  },
  {
    name: "Track Order",
    path: "/dashboard/customer/track-order",
    icon: <Search />,
  },
  { name: "Profile", path: "/dashboard/customer/profile", icon: <User /> },
];

// Menu items for Admin
const adminMenuItems = [
  { name: "Home", path: "/", icon: <Home /> },
  { name: "Dashboard", path: "/dashboard/admin", icon: <LayoutDashboard /> },
  { name: "Manage Users", path: "/dashboard/admin/manage-users", icon: <Users /> },
  { name: "Profile", path: "/dashboard/admin/profile", icon: <User /> },
];

export default function DashboardSidebar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Determine which menu items to display based on user role
  let menuItems = customerMenuItems; // Default to customer
  
  if (user?.role === "provider") {
    menuItems = providerMenuItems;
  } else if (user?.role === "admin") {
    menuItems = adminMenuItems;
  }

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    router.push("/login");
    toast.success("Logged out successfully");
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-[60px] items-center px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Feedme</span>
          </Link>
        </div>
      </SidebarHeader>
      {/* sidebar menu items */}
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item, index) => (
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
      {/* sidebar footer: for logout etc */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button 
                className="w-full text-left text-red-500 hover:text-red-600"
                onClick={handleLogout}
              >
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
