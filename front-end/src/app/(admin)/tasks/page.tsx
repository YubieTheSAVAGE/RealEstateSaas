import { Metadata } from "next";
import TasksPageContent from "./TasksPageContent";

export const metadata: Metadata = {
  title: "Tâches - Immo 360",
  description: "Gestion des tâches et kanban - Immo 360",
  icons: {
    icon: "./favicon.ico",
    shortcut: "./favicon.ico",
    apple: "./favicon.ico",
  },
};

export default function TaskKanban() {
  return <TasksPageContent />;
}