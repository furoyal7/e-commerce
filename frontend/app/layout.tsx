import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "../components/providers/query-provider";
import { UIProvider } from "../context/UIContext";
import FlyoutSidebar from "../components/FlyoutSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AmazonX | Global Corporate Storefront",
  description: "International enterprise e-commerce platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" style={{ height: '100%', width: '100%', margin: 0, padding: 0 }}>
      <body style={{ height: '100%', width: '100%', margin: 0, padding: 0 }}>
        <QueryProvider>
          <UIProvider>
            <FlyoutSidebar />
            {children}
          </UIProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
