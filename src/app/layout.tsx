import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "TBC — Teesbychees · Wear Yours",
  description:
    "Custom apparel built around your graphics. Upload, place, preview in 3D — pay only when it's exactly right. Established 2023, Trinidad.",
  keywords: [
    "TBC",
    "Teesbychees",
    "custom t-shirts",
    "Trinidad apparel",
    "graphic tees",
    "3D configurator",
    "streetwear",
  ],
  openGraph: {
    title: "TBC — Teesbychees · Wear Yours",
    description:
      "Custom apparel built around your graphics. Upload, place, preview in 3D.",
    type: "website",
    locale: "en_TT",
    siteName: "Teesbychees",
  },
};

import { Bodoni_Moda, Inter_Tight } from 'next/font/google';

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-bodoni',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

import { CartDrawer } from "@/components/cart/CartDrawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${interTight.variable} ${bodoni.variable} min-h-full bg-tbc-white text-tbc-black antialiased`} style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
