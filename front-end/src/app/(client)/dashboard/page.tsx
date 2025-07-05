import { Metadata } from "next";
import ClientDashboardContent from "./ClientDashboardContent";

export const metadata: Metadata = {
  title: "Tableau de bord - Immo 360",
  description: "Tableau de bord client",
  icons: {
    icon: "./favicon.ico",
    shortcut: "./favicon.ico",
    apple: "./favicon.ico",
  },
};

export default function ClientDashboard() {
  return <ClientDashboardContent />;
}
