import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "VersaLife Telemedicine",
  description:
    "VersaLife is a telemedicine visit: choose a doctor, say who the appointment is for, join the video call, and keep the notes and prescription.",
  metadataBase: new URL("https://telemedicine.versalifehealth.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "192x192", type: "image/png" }],
  },
  openGraph: {
    title: "VersaLife Telemedicine",
    description:
      "VersaLife is a telemedicine visit: choose a doctor, say who the appointment is for, join the video call, and keep the notes and prescription.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VersaLife Health",
  url: "https://versalifehealth.com",
  logo: "https://versalifehealth.com/apple-touch-icon.png",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preload" href="/video/hero.mp4" as="fetch" type="video/mp4" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k="versalife-hero-splash";if(sessionStorage.getItem(k))document.documentElement.classList.add("splash-seen");}catch(e){}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
