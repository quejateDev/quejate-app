import { SidebarProvider } from "@/components/ui/sidebar";

import "../globals.css";
import NavbarDashboard from "@/components/Navbar/NavbarDashboard";
import LoginModalProvider from "@/providers/LoginModalProivder";
import LoginModal from "@/components/modals/LoginModal";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <main className="flex-1 flex-col bg-white">
        <LoginModalProvider>
            <div className="w-full"> 
              <NavbarDashboard />
            </div>
            <div className="flex-1 w-full mx-auto mb-12">
              <LoginModal />
              {children}
            </div>
          </LoginModalProvider>
        </main>
      </SidebarProvider>
      <Footer />
    </>
  );
}
