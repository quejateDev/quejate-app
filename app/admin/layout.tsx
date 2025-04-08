import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import { NavbarAdmin } from "@/components/Navbar/NavbarAdmin";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex w-full">
          {/* Sidebar */}
          <AppSidebar />
          
          {/* Main Content */}
          <main className="flex-1 flex flex-col min-h-screen">
            {/* Navbar */}
            <NavbarAdmin />
            
            {/* Content Area */}
            <div className="flex-1 p-6 bg-[#ecedff]">
              {children}
            </div>
          </main>
          
          {/* Mobile Sidebar Trigger */}
          <SidebarTrigger className="fixed top-4 left-4 z-50 lg:hidden" />
        </div>
        
        <Toaster />
      </SidebarProvider>
    </div>
  );
}
