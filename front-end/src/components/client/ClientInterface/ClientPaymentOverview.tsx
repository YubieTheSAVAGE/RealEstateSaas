import React from "react";
import { Client } from "@/types/client";
import { Card } from "@/components/ui/card";
import Badge from "@/components/ui/badge/Badge";
import ProgressBar from "@/components/progress-bar/ProgressBar";

interface ClientPaymentOverviewProps {
  client: Client;
}

const formatCurrency = (amount: number) =>
  amount.toLocaleString("fr-MA") + " DH";

const ClientPaymentOverview: React.FC<ClientPaymentOverviewProps> = ({ client }) => {
  // Aggregate all properties and payments
  const properties = client.apartments || [];
  const totalAmount = properties.reduce((sum, prop) => sum + (prop.price || 0), 0);
  const payments = client.payments || [];
  const paidPayments = payments.filter((p) => p.status === "PAID");
  const remainingPayments = payments.filter((p) => p.status !== "PAID");
  const paidAmount = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = Math.max(totalAmount - paidAmount, 0);
  const progress = totalAmount > 0 ? Math.min((paidAmount / totalAmount) * 100, 100) : 0;

  return (
    <Card>
      <div className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Vue d'ensemble des paiements
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Progression globale de vos investissements
          </div>
        </div>
        
        {/* Mobile: Stack cards vertically, Desktop: Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 my-4 sm:my-6">
          {/* Paid Amount */}
          <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 dark:border dark:border-green-800/20 p-4 sm:p-6 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px]">
            <div className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300">
              {formatCurrency(paidAmount)}
            </div>
            <div className="text-xs sm:text-sm text-green-700 dark:text-green-300 mt-1 text-center">
              Montant payé
            </div>
            <Badge color="success" size="sm" className="mt-2">
              {paidPayments.length} paiement{paidPayments.length > 1 ? "s" : ""}
            </Badge>
          </div>
          
          {/* Remaining Amount */}
          <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/10 dark:border dark:border-orange-800/20 p-4 sm:p-6 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px]">
            <div className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-300">
              {formatCurrency(remainingAmount)}
            </div>
            <div className="text-xs sm:text-sm text-orange-600 dark:text-orange-300 mt-1 text-center">
              Montant restant
            </div>
            <Badge color="warning" size="sm" className="mt-2">
              {remainingPayments.length} échéance{remainingPayments.length > 1 ? "s" : ""}
            </Badge>
          </div>
          
          {/* Progress */}
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 dark:border dark:border-blue-800/20 p-4 sm:p-6 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] sm:col-span-2 lg:col-span-1">
            <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-300">
              {progress.toFixed(1)}%
            </div>
            <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-300 mt-1 text-center">
              Progression
            </div>
            <span className="text-xs text-blue-400 dark:text-blue-200 mt-2 text-center">
              Objectif atteint
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 sm:mt-6">
          <div className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
            Progression des paiements
          </div>
          <ProgressBar progress={parseFloat(progress.toFixed(1))} size="md" />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span className="text-left">
              {paidPayments.length} sur {payments.length} échéances payées
            </span>
            <span className="font-bold text-blue-700 dark:text-blue-300 text-right ml-2">
              {progress.toFixed(1)}%
            </span>
          </div>
        </div>
        
        {properties.length > 1 && (
          <div className="mt-4 sm:mt-6 text-xs text-gray-400 dark:text-gray-500 text-center">
            ({properties.length} propriétés incluses dans ce résumé)
          </div>
        )}
      </div>
    </Card>
  );
};

export default ClientPaymentOverview;
