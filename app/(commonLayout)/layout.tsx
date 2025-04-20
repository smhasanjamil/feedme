import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
