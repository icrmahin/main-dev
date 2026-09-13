import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from '../components/navigation'

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mahin — Product Engineer",
  description:
    "Mahin is a product engineer working across product design, interface engineering, frontend development, mobile applications, and software systems.",
  keywords: [
    "Mahin",
    "Product Engineer",
    "Software Engineer",
    "Frontend Engineer",
    "Product Design",
    "UI/UX",
    "React",
    "Next.js",
    "TypeScript",
    "React Native",
    "Expo",
    "Supabase",
    "Design Systems",
  ],
  authors: [{ name: "Mahin" }],
  creator: "Mahin",
  openGraph: {
    title: "Mahin — Product Engineer",
    description:
      "Product engineer working across design, interfaces, frontend engineering, mobile applications, and software systems.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        <Navigation/>
        {children}
      </body>
    </html>
  );
}
