import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "./components/navigation/Navigation";
import PageLoader from "./components/page-loader";
import SmoothScroll from "./components/smooth-scroll";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://icrmahin.dev";

const SITE_NAME = "Abdulla Al Mahin";
const SITE_TITLE = "Abdulla Al Mahin — Product Engineer";
const SITE_DESCRIPTION =
  "Abdulla Al Mahin (Mahin, icrmahin) — Product Engineer based in Dhaka. I design, engineer, and ship digital products: interfaces, frontend systems, and AI-powered web applications with Next.js, React, and TypeScript.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Abdulla Al Mahin",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  keywords: [
    "Abdulla Al Mahin",
    "Mahin",
    "icrmahin",
    "Product Engineer",
    "Product Engineering",
    "Frontend Engineering",
    "Digital Products",
    "Next.js",
    "React",
    "TypeScript",
    "Interface Design",
    "Design Systems",
    "Web Applications",
    "Dhaka",
    "Bangladesh",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/avater.jpg",
        width: 1200,
        height: 1200,
        alt: "Abdulla Al Mahin — Product Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/avater.jpg"],
    creator: "@icrmahin",
  },
  icons: {
    icon: "/avater.jpg",
    apple: "/avater.jpg",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#f7f7fb",
  colorScheme: "light",
};

const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Abdulla Al Mahin",
  alternateName: ["Mahin", "icrmahin"],
  url: SITE_URL,
  image: `${SITE_URL}/avater.jpg`,
  jobTitle: "Product Engineer",
  description: SITE_DESCRIPTION,
  sameAs: [
    "https://github.com/icrmahin",
    "https://icwmahin.github.io/",
    "https://mahinflux.framer.ai/",
    "https://ibwmahin.framer.media/",
  ],
} as const;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col flex-1 bg-background">
        <a
          href="#main-content"
          className="sr-only left-4 top-4 z-[100] rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-violet)]"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
        <SmoothScroll>
          <PageLoader />
          <Navigation />
          <div id="main-content">{children}</div>
        </SmoothScroll>
      </body>
    </html>
  );
}
