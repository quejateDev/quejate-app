import { SidebarProvider } from "@/components/ui/sidebar";

import "../globals.css";
import NavbarDashboard from "@/components/Navbar/NavbarDashboard";
import Footer from "@/components/footer";
import LoginModalProvider from "@/providers/LoginModalProivder";
import LoginModal from "@/components/modals/LoginModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <main className="flex-1 flex-col">
        <LoginModalProvider>
            <div className="w-full"> 
              <NavbarDashboard />
            </div>
            <div className="flex-1 px-6 py-4 w-full max-w-7xl mx-auto">
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
