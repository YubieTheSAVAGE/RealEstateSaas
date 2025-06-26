import { Metadata } from "next";
import PropertiesPageContent from "./PropertiesPageContent";

export const metadata: Metadata = {
  title: "Propriétés - Immo 360",
  description: "Gestion des propriétés immobilières - Immo 360",
  icons: {
    icon: "./favicon.ico",
    shortcut: "./favicon.ico",
    apple: "./favicon.ico",
  },
};

export default function Properties() {
  return <PropertiesPageContent />;
}