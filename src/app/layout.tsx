import type { Metadata, Viewport } from "next";
import { Figtree, IBM_Plex_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import "./globals.css";

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "PiggyPower | CHP Thermoelectric Generation Systems",
    template: "%s | PiggyPower",
  },
  description:
    "PiggyPower systems use one heat source to make electricity for your devices while also warming water for space heat or hot water. Designed, assembled, and tested in the USA.",
  metadataBase: new URL("https://www.officialpiggypower.com"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1e63b6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${body.variable} ${mono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col overflow-x-hidden bg-paper font-sans text-ink">
        <Header />
        <main className="w-full flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
