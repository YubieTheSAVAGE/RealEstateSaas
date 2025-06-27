import { Metadata } from "next";
import ClientsPageContent from "./ClientsPageContent";

export const metadata: Metadata = {
  title: "Clients - Immo 360",
  description: "Gestion des clients",
  icons: {
    icon: "./favicon.ico",
    shortcut: "./favicon.ico",
    apple: "./favicon.ico",
  },
};

export default function Clients() {
  return <ClientsPageContent />;
}