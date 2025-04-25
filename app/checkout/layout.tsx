import { Toaster } from "react-hot-toast";
import Navbar from "@/components/ui/navbar";

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Navbar />
      {children}
      <Toaster position="top-right" />
    </main>
  );
}
