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
  title: "VersaLife — book a doctor visit",
  description:
    "VersaLife is a telemedicine visit: choose a doctor, say who the appointment is for, join the video call, and keep the notes and prescription.",
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
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
