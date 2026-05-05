import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;0,6..96,900;1,6..96,400&family=Inter+Tight:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-tbc-white text-tbc-black antialiased" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
