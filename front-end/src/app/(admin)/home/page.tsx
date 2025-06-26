import { Metadata } from "next";
import HomePageContent from "./HomePageContent";

export const metadata: Metadata = {
  title: "Accueil - Immo 360",
  description: "Tableau de bord de gestion immobilière - Immo 360",
  icons: {
    icon: "./favicon.ico",
    shortcut: "./favicon.ico",
    apple: "./favicon.ico",
  },
};

export default function Home() {
  return <HomePageContent />;
}
