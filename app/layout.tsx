import { Sora, Be_Vietnam_Pro } from "next/font/google";
import { Providers } from "./providers";
import { Metadata } from "next";

// Configuración de Sora (fuente principal)
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "500", "600", "700"], // Especifica los pesos que necesites
});

// Configuración de Be Vietnam Pro (fuente secundaria)
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
  weight: ["400", "500", "600", "700"], // Ajusta según necesites
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
      </head>
      <body className="font-sans antialiased"> {/* font-sans usará Sora por defecto */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}