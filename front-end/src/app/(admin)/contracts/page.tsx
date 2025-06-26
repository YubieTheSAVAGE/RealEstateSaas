
import Contract from "@/components/contract/Contract";
import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contrats",
  description: "Gestion des contrats",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function ContractsPage() {
  const threeLayerItems = [
    { label: "Accueil", href: "/" },
    { label: "Contrats", href: "/contracts" },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2
              className="text-xl font-semibold text-gray-800 dark:text-white/90"
              x-text="pageName"
          >
              Gestion des contrats
          </h2>
          <Breadcrumb items={threeLayerItems} variant="withIcon" />
        </div>
        <Contract />
    </>
  )
}