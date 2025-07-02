// Backup layout without Google Fonts for Docker compatibility
import "./globals.css";
import "./fonts.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import NextTopLoader from "nextjs-toploader";
import { Metadata } from "next";

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
        {/* Fallback font loading */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body 
        suppressHydrationWarning={true} 
        className="dark:bg-gray-900 bg-gray-25"
        style={{ 
          fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' 
        }}
      >
        <NextTopLoader />
        <ThemeProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
