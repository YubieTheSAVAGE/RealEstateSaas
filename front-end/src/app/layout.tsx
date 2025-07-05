// "use client";
import "./globals.css";
import "./fonts.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import NextTopLoader from "nextjs-toploader";
import { Metadata } from "next";
import PerformanceMonitor from "@/components/ui/PerformanceMonitor";
import { outfit, fontFamily } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Immo 360",
  description: "Gestion immobilière",
  icons: {
    icon: "./favicon.ico",
    shortcut: "./favicon.ico",
    apple: "./favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning={true} className={`${outfit.variable} dark:bg-gray-900 bg-gray-25`} style={{ fontFamily }}>
        <NextTopLoader />
        <PerformanceMonitor />
          <ThemeProvider>
            <SidebarProvider>
              {children}
            </SidebarProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
