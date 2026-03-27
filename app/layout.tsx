import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Menu Profit Optimizer — AI-Powered Restaurant Profitability",
  description:
    "Analyze and optimize your restaurant menu pricing with AI-powered insights. Maximize profitability with Claude AI recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${spaceGrotesk.variable} h-full`}>
        <body className="min-h-full flex flex-col" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
