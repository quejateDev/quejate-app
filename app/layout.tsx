import { Sora, Be_Vietnam_Pro } from "next/font/google";
import { Providers } from "./providers";
import { Metadata } from "next";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});


const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Quejate",
  description: "Quejate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${sora.variable} ${beVietnamPro.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/IsotipoVector.svg" type="image/svg+xml" />
      </head>
      <body className="font-sans antialiased"> 
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}