import { Metadata } from "next";
import AgentsPageContent from "./AgentsPageContent";

export const metadata: Metadata = {
  title: "Agents - Immo 360",
  description: "Gestion des agents",
  icons: {
    icon: "./favicon.ico",
    shortcut: "./favicon.ico",
    apple: "./favicon.ico",
  },
};

export default function AgentsPage() {
  return <AgentsPageContent />;
}