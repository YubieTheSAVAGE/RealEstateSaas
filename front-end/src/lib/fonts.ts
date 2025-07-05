import { Outfit } from "next/font/google";

// Configure Outfit font with fallbacks
export const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  fallback: [
    "Outfit",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif"
  ],
  preload: true,
  adjustFontFallback: true,
});

// Font CSS variable for use in components
export const fontVariables = `${outfit.variable}`;

// Font family string for inline styles
export const fontFamily = `var(--font-outfit-sans), ${outfit.style.fontFamily}`;
