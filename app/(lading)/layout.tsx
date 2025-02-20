import Footer from "@/components/footer";
import "../globals.css";
import { Navbar } from "@/components/Navbar/NavbarLanding";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
