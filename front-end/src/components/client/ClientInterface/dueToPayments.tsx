"use client"
import React, { useState, useMemo } from "react";
import { FaCheckCircle, FaHourglassHalf, FaExclamationCircle, FaPaperclip, FaDownload, FaSearch } from "react-icons/fa";
import { Payment } from "../../../types/Payment";
import ClientPaymentsDropdownFilter from "@/components/example/DropdownExample/ClientPaymentsDropdownFilter";
import { PropertyFilters } from "@/components/example/DropdownExample/ClientPaymentsDropdownFilter";
import { Input } from "@/components/ui/input";
import PaginationWithIcon from "@/components/ui/pagination/PaginationWitIcon";

interface DueToPaymentsProps {
  payments: Payment[];
}

type PaymentStatus = "PAID" | "PENDING" | "LATE" | "UPCOMING";

const statusStyles: Record<PaymentStatus, string> = {
  PAID: "border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400",
  PENDING: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  LATE: "border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
  UPCOMING: "border-gray-300 bg-gray-100 text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const badgeStyles: Record<PaymentStatus, string> = {
  PAID: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  LATE: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  UPCOMING: "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
};

const statusOptions: { value: string; label: string }[] = [
  { value: "ALL", label: "Tous" },
  { value: "PAID", label: "Payé" },
  { value: "PENDING", label: "En attente" },
  { value: "LATE", label: "En retard" },
  { value: "UPCOMING", label: "À venir" },
];

const sortOptions = [
  { value: "dueDate-asc", label: "Date d'échéance croissante" },
  { value: "dueDate-desc", label: "Date d'échéance décroissante" },
  { value: "amount-asc", label: "Montant croissant" },
  { value: "amount-desc", label: "Montant décroissant" },
  { value: "status", label: "Statut" },
];

const getStatusIcon = (status: PaymentStatus) => {
  switch (status) {
    case "PAID":
      return <FaCheckCircle aria-label="Payé" className="text-green-600 text-lg sm:text-xl md:text-2xl" />;
    case "PENDING":
      return <FaHourglassHalf aria-label="En attente" className="text-yellow-700 text-lg sm:text-xl md:text-2xl" />;
    case "LATE":
      return <FaExclamationCircle aria-label="En retard" className="text-red-600 text-lg sm:text-xl md:text-2xl" />;
    case "UPCOMING":
      return <FaHourglassHalf aria-label="À venir" className="text-gray-500 text-lg sm:text-xl md:text-2xl" />;
    default:
      return null;
  }
};

const getStatusLabel = (status: PaymentStatus) => {
  switch (status) {
    case "PAID":
      return "Payé";
    case "PENDING":
      return "En attente";
    case "LATE":
      return "En retard";
    case "UPCOMING":
      return "À venir";
    default:
      return "";
  }
};

const formatDate = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getPaymentStatus = (payment: Payment): PaymentStatus => {
  const now = new Date();
  const due = new Date(payment.dueDate);
  if (payment.status === "PAID") return "PAID";
  if (payment.status === "LATE") return "LATE";
  if (payment.status === "PENDING") {
    if (due > now) return "UPCOMING";
    return "PENDING";
  }
  if (due > now) return "UPCOMING";
  return "PENDING";
};

const getDaysLate = (dueDate: Date | string) => {
  const due = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  const now = new Date();
  const diff = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

const PAGE_SIZE = 10;

const PaymentCard: React.FC<{ payment: Payment; index: number }> = ({ payment, index }) => {
  const status = getPaymentStatus(payment);
  const isLate = status === "LATE";
  const isFirst = payment.isFirstPayment;
  const title = isFirst ? "Premier versement" : `Versement ${index + 1}`;
  const propertyLabel = payment.property?.number || "";
  return (
    <div
      className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl mb-3 sm:mb-5 border shadow-sm ${statusStyles[status]}`}
      aria-label={`Paiement ${title}`}
    >
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-shrink-0">{getStatusIcon(status)}</div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate dark:text-white">{title}</div>
            <div className="text-gray-500 dark:text-gray-400 text-xs truncate">{propertyLabel}</div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${badgeStyles[status]}`}>
            {getStatusLabel(status)}
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="text-gray-700 dark:text-gray-300 text-sm">
              <div className="font-medium">{formatDate(payment.dueDate)}</div>
              <div className="text-gray-400 dark:text-gray-500 text-xs">Date d'échéance</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-base text-gray-900 dark:text-white">
                {payment.amount.toLocaleString("fr-FR")} DH
              </div>
              {payment.percentageOfTotal && (
                <div className="text-gray-500 dark:text-gray-400 text-xs">({payment.percentageOfTotal}%)</div>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            {isLate && (
              <span className="text-red-600 dark:text-red-400 text-xs font-medium">
                {getDaysLate(payment.dueDate)} jours de retard
              </span>
            )}
            {status === "PAID" && (
              <button 
                className="flex items-center gap-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors p-2 -m-2 rounded"
                aria-label="Télécharger le reçu"
              >
                <FaDownload size={14} />
                <span className="text-xs">Télécharger</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:items-center lg:justify-between">
        {/* Left section - Icon, title, and property */}
        <div className="flex items-center gap-5">
          <div className="flex-shrink-0">{getStatusIcon(status)}</div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="font-semibold text-base truncate dark:text-white">{title}</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm truncate">{propertyLabel}</div>
          </div>
        </div>
        
        {/* Right section - Date, amount, status, and actions */}
        <div className="flex items-center gap-8">
          {/* Date and Amount */}
          <div className="flex items-center gap-4">
            <div className="text-gray-700 dark:text-gray-300 text-base">
              <span className="inline">{formatDate(payment.dueDate)}</span>
              <br />
              <span className="text-gray-400 dark:text-gray-500 text-sm">Date d'échéance</span>
            </div>
            
            <div className="font-bold text-lg text-gray-900 dark:text-white">
              <span className="inline">{payment.amount.toLocaleString("fr-FR")} DH</span>
              {payment.percentageOfTotal && (
                <span className="text-gray-500 dark:text-gray-400 font-normal text-sm"> ({payment.percentageOfTotal}%)</span>
              )}
            </div>
          </div>
          
          {/* Status badge and actions */}
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${badgeStyles[status]} w-fit`}>
              {getStatusLabel(status)}
            </div>
            
            {isLate && (
              <span className="text-red-600 dark:text-red-400 text-sm font-medium">{getDaysLate(payment.dueDate)} jours de retard</span>
            )}
            
            {status === "PAID" && (
              <button 
                className="flex items-center gap-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors p-1 -m-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                aria-label="Télécharger le reçu"
              >
                <FaDownload size={16} />
                <span className="ml-1">Télécharger</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const DueToPayments: React.FC<DueToPaymentsProps> = ({ payments }) => {
  // State for filter, sort, and pagination
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [propertyFilter, setPropertyFilter] = useState<string>("");
  const [sort, setSort] = useState<string>("dueDate-asc");
  const [page, setPage] = useState<number>(1);
  const [dropdownFilters, setDropdownFilters] = useState<PropertyFilters>({
    paid: false,
    pending: false,
    late: false,
    dateIncreasing: false,
    dateDecreasing: false,
    amountIncreasing: false,
    amountDecreasing: false,
  });

  // Filtering
  const filteredPayments = useMemo(() => {
    let filtered = payments.map((p) => ({ ...p, _computedStatus: getPaymentStatus(p) }));
    
    // Handle status filtering based on dropdown filters
    const hasStatusFilter = dropdownFilters.paid || dropdownFilters.pending || dropdownFilters.late;
    if (hasStatusFilter) {
      filtered = filtered.filter((p) => {
        const status = p._computedStatus;
        return (dropdownFilters.paid && status === "PAID") ||
               (dropdownFilters.pending && status === "PENDING") ||
               (dropdownFilters.late && status === "LATE");
      });
    } else if (statusFilter !== "ALL") {
      // Fallback to single status filter if no dropdown filters
      filtered = filtered.filter((p) => p._computedStatus === statusFilter);
    }
    
    if (propertyFilter.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.property?.number?.toLowerCase().includes(propertyFilter.trim().toLowerCase())
      );
    }
    return filtered;
  }, [payments, statusFilter, propertyFilter, dropdownFilters]);

  // Sorting
  const sortedPayments = useMemo(() => {
    const arr = [...filteredPayments];
    switch (sort) {
      case "dueDate-asc":
        arr.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        break;
      case "dueDate-desc":
        arr.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
        break;
      case "amount-asc":
        arr.sort((a, b) => a.amount - b.amount);
        break;
      case "amount-desc":
        arr.sort((a, b) => b.amount - a.amount);
        break;
      case "status":
        arr.sort((a, b) => (a._computedStatus > b._computedStatus ? 1 : -1));
        break;
      default:
        break;
    }
    return arr;
  }, [filteredPayments, sort]);

  // Pagination
  const totalPages = Math.ceil(sortedPayments.length / PAGE_SIZE) || 1;
  const paginatedPayments = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedPayments.slice(start, start + PAGE_SIZE);
  }, [sortedPayments, page]);

  // Handlers
  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };
  const handlePropertyFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPropertyFilter(e.target.value);
    setPage(1);
  };
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    setPage(1);
  };
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const handleDropdownFilterChange = (filters: PropertyFilters) => {
    // Store the dropdown filters
    setDropdownFilters(filters);

    // Handle date sorting
    if (filters.dateIncreasing) {
      setSort("dueDate-asc");
    } else if (filters.dateDecreasing) {
      setSort("dueDate-desc");
    }

    // Handle amount sorting
    if (filters.amountIncreasing) {
      setSort("amount-asc");
    } else if (filters.amountDecreasing) {
      setSort("amount-desc");
    }

    // Reset to page 1 when filters change
    setPage(1);
  };

  if (!payments || payments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 max-w-3xl mx-auto mt-4 sm:mt-8">
        <div className="text-lg sm:text-xl md:text-2xl font-bold mb-1">Calendrier des échéances</div>
        <div className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6 md:mb-8">Chronologie détaillée de vos paiements</div>
        <div className="text-center text-gray-400 text-sm sm:text-base md:text-lg py-6 sm:py-8 md:py-12">Aucun paiement à afficher.</div>
      </div>
    );
  }
  return (
    <div className="bg-white border border-gray-200 dark:border-gray-800 dark:bg-white/[0.03] rounded-xl sm:rounded-2xl p-3 sm:p-6 lg:p-8 mx-auto mt-4 sm:mt-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Vue d'ensemble des paiements
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Progression globale de vos investissements
        </div>
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-6">
        <div className="relative w-full sm:w-auto">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
          <input
              type="text"
              placeholder="Numéro de lot..."
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="pl-10 pr-4 py-3 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 w-full sm:w-64 text-sm sm:text-base min-h-[44px]"
          />
        </div>
        <div className="flex justify-end w-full sm:w-auto">
          <ClientPaymentsDropdownFilter
            onFilterChange={handleDropdownFilterChange}
            initialFilters={dropdownFilters}
          />
        </div>
      </div>
      
      {/* List */}
      <div className="max-h-[450px] sm:max-h-[600px] overflow-y-auto pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50" role="list" aria-label="Liste des paiements">
        {paginatedPayments.length === 0 ? (
          <div className="text-center text-gray-400 text-sm sm:text-base md:text-lg py-6 sm:py-8 md:py-12">Aucun paiement trouvé.</div>
        ) : (
          paginatedPayments.map((payment, idx) => (
            <PaymentCard key={payment.id} payment={payment} index={idx + (page - 1) * PAGE_SIZE} />
          ))
        )}
      </div>
      
      {/* Pagination */}
      {filteredPayments.length > 0 && totalPages > 1 && (
        <div className="w-full border-t border-gray-200 dark:border-gray-800 mt-4 sm:mt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between py-3 sm:py-4 gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 order-2 sm:order-1">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Page {page} de {totalPages}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                ({paginatedPayments.length}/{filteredPayments.length})
              </span>
            </div>
            <div className="flex items-center justify-center order-1 sm:order-2">
              <PaginationWithIcon
                totalPages={totalPages}
                initialPage={1}
                onPageChange={handlePageChange}
              />
            </div>
            <div className="order-3 text-center sm:text-right">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Affichage de {paginatedPayments.length} sur {filteredPayments.length} paiements
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DueToPayments;
