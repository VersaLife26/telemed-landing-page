import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "VersaLife — book a doctor visit",
  description:
    "VersaLife is a telemedicine visit: choose a doctor, say who the appointment is for, join the video call, and keep the notes and prescription.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body style={{ fontFamily: "var(--font-body), Manrope, sans-serif" }}>{children}</body>
    </html>
  );
}
