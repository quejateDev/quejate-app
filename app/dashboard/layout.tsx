import { SidebarProvider } from "@/components/ui/sidebar";

import "../globals.css";
import NavbarDashboard from "@/components/Navbar/NavbarDashboard";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <main className="flex-1 flex-col">
          <NavbarDashboard />
          <div className="flex-1 flex-col px-6 py-4">
            {children}
          </div>
          <Footer />
        </main>
      </SidebarProvider>
    </>
  );
}
