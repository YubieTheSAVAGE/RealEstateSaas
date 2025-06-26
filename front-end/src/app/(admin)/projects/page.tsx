import { Metadata } from "next";
import ProjectsPageContent from "./ProjectsPageContent";

export const metadata: Metadata = {
  title: "Projets - Immo 360",
  description: "Gestion des projets immobiliers - Immo 360",
  icons: {
    icon: "./favicon.ico",
    shortcut: "./favicon.ico",
    apple: "./favicon.ico",
  },
};

export default function Projects() {
  return <ProjectsPageContent />;
}