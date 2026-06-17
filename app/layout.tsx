import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { LocaleProvider } from "@/components/LocaleProvider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-sans",
});

const SITE_URL = "https://bistrosapa.com";
const OG_IMAGE = "/images/exterior-night.webp";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "bistro.sapa — Bar & Eatery in Sa Pa, Vietnam",
    template: "%s · bistro.sapa",
  },
  description:
    "A rustic bar and kitchen on Mường Hoa street in the heart of Sa Pa. Vietnamese craft beer, proper cocktails, Australian pastries, and live music. Open all day.",
  keywords: [
    "bistro sapa",
    "bar Sapa Vietnam",
    "craft beer Sapa",
    "cocktails Sa Pa",
    "live music Sapa",
    "Mường Hoa bar",
    "Sapa Vietnam restaurant",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "bistro.sapa",
    title: "bistro.sapa — Bar & Eatery in Sa Pa, Vietnam",
    description:
      "Vietnamese craft beer, cocktails, and a kitchen open all day. On Mường Hoa, Sa Pa.",
    images: [{ url: OG_IMAGE, width: 1200, height: 800, alt: "bistro.sapa bar interior" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "bistro.sapa — Bar & Eatery in Sa Pa, Vietnam",
    description:
      "Vietnamese craft beer, cocktails, and a kitchen open all day. On Mường Hoa, Sa Pa.",
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BarOrPub",
    name: "bistro.sapa",
    alternateName: "bistro.sapa - Bar & Eatery",
    description:
      "Rustic neighbourhood bar and kitchen in Sa Pa, Vietnam. Vietnamese craft beer, cocktails, Australian pastries, and live music. Open daily 10am–midnight.",
    url: SITE_URL,
    telephone: "+84 333 33 88 12",
    image: OG_IMAGE,
    priceRange: "₫₫",
    servesCuisine: ["Vietnamese", "Australian", "European", "Cocktails", "Craft Beer"],
    menu: `${SITE_URL}/#menu`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "7 Mường Hoa",
      addressLocality: "Sa Pa",
      addressRegion: "Lào Cai",
      postalCode: "330000",
      addressCountry: "VN",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "00:00",
      },
    ],
  };

  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        <LocaleProvider>{children}</LocaleProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
