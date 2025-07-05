import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes Contrats - Immo 360",
  description: "Mes contrats",
  icons: {
    icon: "./favicon.ico",
    shortcut: "./favicon.ico",
    apple: "./favicon.ico",
  },
};

export default function MyContracts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mes Contrats
        </h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Page en construction
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Cette page sera bientôt disponible pour consulter vos contrats.
          </p>
        </div>
      </div>
    </div>
  );
}
