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
  const totalAmount = properties.reduce((sum, prop) => sum + (prop.prixTotal || 0), 0);
  const payments = client.payments || [];
  const paidPayments = payments.filter((p) => p.status === "PAID");
  const remainingPayments = payments.filter((p) => p.status !== "PAID");
  const paidAmount = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = Math.max(totalAmount - paidAmount, 0);
  const progress = totalAmount > 0 ? Math.min((paidAmount / totalAmount) * 100, 100) : 0;

  return (
    <Card>
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Vue d'ensemble des paiements
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Progression globale de vos investissements
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        {/* Paid Amount */}
        <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/10 p-6 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {formatCurrency(paidAmount)}
          </div>
          <div className="text-sm text-green-700 dark:text-green-300 mt-1">Montant payé</div>
          <Badge color="success" size="sm" className="mt-2">
            {paidPayments.length} paiement{paidPayments.length > 1 ? "s" : ""}
          </Badge>
        </div>
        {/* Remaining Amount */}
        <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/10 p-6 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-300">
            {formatCurrency(remainingAmount)}
          </div>
          <div className="text-sm text-orange-600 dark:text-orange-300 mt-1">Montant restant</div>
          <Badge color="warning" size="sm" className="mt-2">
            {remainingPayments.length} échéance{remainingPayments.length > 1 ? "s" : ""}
          </Badge>
        </div>
        {/* Progress */}
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/10 p-6 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
            {progress.toFixed(1)}%
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-300 mt-1">Progression</div>
          <span className="text-xs text-blue-400 dark:text-blue-200 mt-2">Objectif atteint</span>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mt-6">
        <div className="font-medium text-gray-900 dark:text-white mb-2">
          Progression des paiements
        </div>
        <ProgressBar progress={parseFloat(progress.toFixed(1))} size="md" />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>{paidPayments.length} sur {payments.length} échéances payées</span>
          <span className="font-bold text-blue-700 dark:text-blue-300">{progress.toFixed(1)}%</span>
        </div>
      </div>
      {properties.length > 1 && (
        <div className="mt-6 text-xs text-gray-400 dark:text-gray-500 text-center">
          ({properties.length} propriétés incluses dans ce résumé)
        </div>
      )}
    </Card>
  );
};

export default ClientPaymentOverview;
