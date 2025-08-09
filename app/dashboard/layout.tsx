import { SidebarProvider } from "@/components/ui/sidebar";

import "../globals.css";
import NavbarDashboard from "@/components/Navbar/NavbarDashboard";
import LoginModalProvider from "@/providers/LoginModalProivder";
import LoginModal from "@/components/modals/LoginModal";
import Footer from "@/components/footer";
import { currentUser } from "@/lib/auth";
import { getFullUserWithFollowingStatus } from "@/data/user";
import { UserProvider } from "@/components/UserProvider";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const sessionUser = await currentUser();
  const fullUser = sessionUser
    ? await getFullUserWithFollowingStatus(sessionUser.id)
    : null;

  return (
    <UserProvider value={fullUser}>
      <SidebarProvider>
        <main className="flex-1 flex-col bg-white">
          <LoginModalProvider>
            <div className="w-full"> 
              <NavbarDashboard />
            </div>
            <div className="flex-1 w-full mx-auto">
              <LoginModal />
              {children}
            </div>
          </LoginModalProvider>
        </main>
      </SidebarProvider>
      <Footer />
    </UserProvider>
  );
}
