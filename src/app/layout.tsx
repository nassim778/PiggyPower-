import type { Metadata, Viewport } from "next";
import { Figtree, IBM_Plex_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e63b6" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1419" },
  ],
};

const themeInitScript = `
(function(){
  try {
    var k = 'piggypower-theme';
    var t = localStorage.getItem(k);
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (t === 'dark') document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = t;
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${body.variable} ${mono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col overflow-x-hidden bg-paper font-sans text-ink">
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main className="w-full flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
