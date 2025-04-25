import { ReactNode } from "react";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

export default function OrdersLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
