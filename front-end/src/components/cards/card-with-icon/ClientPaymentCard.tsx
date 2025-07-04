import React from "react";
import { CardTitle } from "../../ui/card";
import { Client } from "@/types/client";
import { Payment } from "@/types/Payment";
import Badge from "@/components/ui/badge/Badge";
import { FaRegCreditCard, FaCalendarAlt, FaMoneyBillWave, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface ClientPaymentCardProps {
  client: Client;
}

export default function ClientPaymentCard({ client }: ClientPaymentCardProps) {
  const router = useRouter();
  const payments = client.payments || [];

  // Calculate payment statistics
  const totalPayments = payments.length;
  const paidPayments = payments.filter(p => p.status === "PAID").length;
  const pendingPayments = payments.filter(p => p.status === "PENDING").length;
  const latePayments = payments.filter(p => p.status === "LATE").length;

  // Calculate total amounts
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payments.filter(p => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === "PENDING").reduce((sum, p) => sum + p.amount, 0);
  const lateAmount = payments.filter(p => p.status === "LATE").reduce((sum, p) => sum + p.amount, 0);

  // Find next due payment
  const nextDuePayment = payments
    .filter(p => p.status === "PENDING" || p.status === "LATE")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  // Calculate progress percentage
  const progressPercentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "success";
      case "PENDING": return "warning";
      case "LATE": return "error";
      default: return "info";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID": return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case "LATE": return <FaExclamationTriangle className="w-4 h-4 text-red-500" />;
      default: return <FaCalendarAlt className="w-4 h-4 text-yellow-500" />;
    }
  };

  if (totalPayments === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 dark:from-blue-500/20 dark:to-blue-600/20 dark:text-blue-400">
            <FaRegCreditCard size={24} />
          </div>
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
            Paiements
          </CardTitle>
        </div>
        
        <div className="text-center py-8">
          <FaRegCreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Aucun paiement enregistré
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 dark:from-blue-500/20 dark:to-blue-600/20 dark:text-blue-400">
          <FaRegCreditCard size={24} />
        </div>
        <div>
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
            Paiements
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {paidPayments} sur {totalPayments} effectués
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progression
          </span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {paidAmount.toLocaleString()} MAD
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">Payé</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
            {pendingAmount.toLocaleString()} MAD
          </div>
          <div className="text-xs text-yellow-600 dark:text-yellow-400">En attente</div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="space-y-3 mb-6">
        {paidPayments > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaCheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Payés</span>
            </div>
            <Badge size="sm" color="success" variant="light">
              {paidPayments}
            </Badge>
          </div>
        )}
        
        {pendingPayments > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">En attente</span>
            </div>
            <Badge size="sm" color="warning" variant="light">
              {pendingPayments}
            </Badge>
          </div>
        )}
        
        {latePayments > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaExclamationTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">En retard</span>
            </div>
            <Badge size="sm" color="error" variant="light">
              {latePayments}
            </Badge>
          </div>
        )}
      </div>

      {/* Next Due Payment */}
      {nextDuePayment && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Prochain paiement
            </span>
            <Badge 
              size="sm" 
              color={getStatusColor(nextDuePayment.status)} 
              variant="light"
            >
              {nextDuePayment.status === "LATE" ? "En retard" : "À venir"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaMoneyBillWave className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {nextDuePayment.amount.toLocaleString()} MAD
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(nextDuePayment.dueDate).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
      )}

      {/* View All Payments Button */}
      <button 
        onClick={() => router.push(`/clients/${client.id}/payments`)}
        className="w-full mt-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium transition-colors duration-200"
      >
        Voir tous les paiements
      </button>
    </div>
  );
} 