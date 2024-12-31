import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import NavbarDashboard from "@/components/Navbar/NavbarAdmin";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />

        <Toaster />
        <main className="flex-1 flex-col">
          <NavbarDashboard />
          <SidebarTrigger className="fixed" />
          <div className="flex-1 flex-col px-6 py-4">{children}</div>
        </main>
      </SidebarProvider>
    </>
  );
}
