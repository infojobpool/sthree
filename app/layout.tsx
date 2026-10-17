import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Outfit } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OfferPopup from "@/components/OfferPopup";
import { StoreProvider } from "@/context/StoreProvider";
import { getHomeMedia, getStorefront } from "@/lib/storefront";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-serif" });
const vibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-script" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sthreedesignerstudio.com"),
  title: { default: "Sthree Designer Studio — The vintage fashion for modern women", template: "%s · Sthree" },
  description: "Sthree Designer Studio in Nagole, Hyderabad. Vintage fashion for modern women — lehengas, suits, and ethnic attire.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Sthree Designer Studio",
    title: "Sthree Designer Studio — The vintage fashion for modern women",
    description: "A sisters' house in Nagole, Hyderabad. Lehengas, sarees, and ethnic attire from the floor.",
    url: "/",
    images: [{ url: "/og.jpg", width: 1920, height: 1080, alt: "Sthree Designer Studio, Nagole" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sthree Designer Studio",
    description: "The vintage fashion for modern women. Nagole, Hyderabad.",
    images: ["/og.jpg"],
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [storefront, media] = await Promise.all([getStorefront(), getHomeMedia()]);
  return (
    <html lang="en" className={`${outfit.variable} ${cormorant.variable} ${vibes.variable}`}>
      <body>
        <StoreProvider catalog={storefront.products} settings={storefront.settings}>
          <Header />
          <main id="content">{children}</main>
          <Footer image={media.footer} />
          <OfferPopup />
        </StoreProvider>
      </body>
    </html>
  );
}
