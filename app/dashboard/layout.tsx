import { SidebarProvider } from "@/components/ui/sidebar";

import "../globals.css";
import NavbarDashboard from "@/components/Navbar/NavbarDashboard";
import Footer from "@/components/footer";
import LoginModalProvider from "@/providers/LoginModalProivder";
import LoginModal from "@/components/Modals/LoginModal";

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
            <NavbarDashboard />
            <div className="flex-1 flex-col px-6 py-4">
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
