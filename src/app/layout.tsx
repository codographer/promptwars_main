import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AccessibilityMenu } from "@/components/a11y/AccessibilityMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WanderLore AI — Generative AI Cultural Travel & Heritage Platform",
  description:
    "Discover destinations and engage with local culture in meaningful ways. WanderLore AI uses Generative AI to recommend attractions, uncover secret hidden gems, narrate time-traveling historical storytelling, promote endangered heritage, and build authentic itineraries.",
  keywords: [
    "Generative AI Travel",
    "Cultural Heritage",
    "Hidden Gems",
    "Time-Traveler Audio Guide",
    "Sustainable Tourism",
    "Google Gemini",
    "Next.js",
  ],
  openGraph: {
    title: "WanderLore AI — Soul of Local Culture",
    description: "AI-powered travel recommendations, historical folklore narration, and ethical heritage protection.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0F1117] text-[#F4F1DE] selection:bg-[#E07A5F] selection:text-white">
        <Navbar />
        <main id="main-content" className="flex-1 w-full">
          {children}
        </main>
        <Footer />
        <AccessibilityMenu />
      </body>
    </html>
  );
}
