"use client";

import Payment from "@/components/payment/Payment";
import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb";

export default function PaymentsPage() {
  const threeLayerItems = [
    { label: "Accueil", href: "/" },
    { label: "Paiements", href: "/payments" },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2
                    className="text-xl font-semibold text-gray-800 dark:text-white/90"
                    x-text="pageName"
                >
                    Gestion des paiements
                </h2>
            <Breadcrumb items={threeLayerItems} variant="withIcon" />
        </div>
        <Payment />
    </>
  )
}