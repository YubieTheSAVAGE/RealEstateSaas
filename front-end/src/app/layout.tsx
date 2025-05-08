"use client";
import { Outfit } from "next/font/google";
import "./globals.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import NextTopLoader from "nextjs-toploader";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        {/* <NextTopLoader /> */}
      <body suppressHydrationWarning={true} className={`${outfit.variable} dark:bg-gray-900`}>
        {/* <NextTopLoader /> */}
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <ThemeProvider>
            <SidebarProvider>
            <NextTopLoader />
              {children}
            </SidebarProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
