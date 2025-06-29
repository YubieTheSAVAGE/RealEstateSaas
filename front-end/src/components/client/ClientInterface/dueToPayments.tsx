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
  PAID: "border-green-200 bg-green-50 text-green-600",
  PENDING: "border-yellow-200 bg-yellow-50 text-yellow-700",
  LATE: "border-red-200 bg-red-50 text-red-600",
  UPCOMING: "border-gray-300 bg-gray-100 text-gray-500",
};

const badgeStyles: Record<PaymentStatus, string> = {
  PAID: "bg-green-100 text-green-600",
  PENDING: "bg-yellow-100 text-yellow-700",
  LATE: "bg-red-100 text-red-600",
  UPCOMING: "bg-gray-200 text-gray-500",
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
      return <FaCheckCircle aria-label="Payé" className="text-green-600 text-2xl" />;
    case "PENDING":
      return <FaHourglassHalf aria-label="En attente" className="text-yellow-700 text-2xl" />;
    case "LATE":
      return <FaExclamationCircle aria-label="En retard" className="text-red-600 text-2xl" />;
    case "UPCOMING":
      return <FaHourglassHalf aria-label="À venir" className="text-gray-500 text-2xl" />;
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
      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-2xl mb-5 border shadow-sm ${statusStyles[status]}`}
      aria-label={`Paiement ${title}`}
    >
      <div className="flex items-center gap-3 sm:gap-5 mb-4 sm:mb-0">
        <div className="flex-shrink-0">{getStatusIcon(status)}</div>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="font-semibold text-sm sm:text-base truncate">{title}</div>
          <div className="text-gray-500 text-xs sm:text-sm truncate">{propertyLabel}</div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 lg:gap-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="text-gray-700 text-sm sm:text-base">
            <span className="block sm:inline">{formatDate(payment.dueDate)}</span>
            <br className="hidden sm:block" />
            <span className="text-gray-400 text-xs sm:text-sm">Date d'échéance</span>
          </div>
          
          <div className="font-bold text-sm sm:text-base text-gray-900">
            <span className="block sm:inline">{payment.amount.toLocaleString("fr-FR")} DH</span>
            {payment.percentageOfTotal && (
              <span className="text-gray-500 font-normal text-xs sm:text-sm"> ({payment.percentageOfTotal}%)</span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${badgeStyles[status]} w-fit`}>
            {getStatusLabel(status)}
          </div>
          
          {isLate && (
            <span className="text-red-600 text-xs sm:text-sm">{getDaysLate(payment.dueDate)} jours de retard</span>
          )}
          
          {status === "PAID" && (
            <FaDownload size={16} className="hover:text-green-700 hover:cursor-pointer transition-colors sm:ml-2" />
          )}
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 max-w-3xl mx-auto mt-8">
        <div className="text-2xl font-bold mb-1">Calendrier des échéances</div>
        <div className="text-gray-500 text-base mb-8">Chronologie détaillée de vos paiements</div>
        <div className="text-center text-gray-400 text-lg py-12">Aucun paiement à afficher.</div>
      </div>
    );
  }
  return (
    <div className="bg-white border border-gray-200 dark:bg-gray-800 rounded-2xl p-4 sm:p-6 lg:p-10 mx-auto mt-8">
      <div className="text-xl sm:text-2xl font-bold mb-1">Calendrier des échéances</div>
      <div className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8">Chronologie détaillée de vos paiements</div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
          <input
              type="text"
              placeholder="Numéro de lot..."
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 w-full sm:w-64"
          />
        </div>
        <div className="flex flex-col w-full sm:w-auto">
          <ClientPaymentsDropdownFilter
            onFilterChange={handleDropdownFilterChange}
            initialFilters={dropdownFilters}
          />
        </div>
      </div>
      {/* List */}
      <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50" role="list" aria-label="Liste des paiements">
        {paginatedPayments.length === 0 ? (
          <div className="text-center text-gray-400 text-lg py-12">Aucun paiement trouvé.</div>
        ) : (
          paginatedPayments.map((payment, idx) => (
            <PaymentCard key={payment.id} payment={payment} index={idx + (page - 1) * PAGE_SIZE} />
          ))
        )}
      </div>
      {/* Pagination */}
      {filteredPayments.length > 0 && totalPages > 1 && (
        <div className="w-full border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
              Page {page} de {totalPages}
            </span>
            <div className="flex items-center justify-center py-0 order-1 sm:order-2">
            <PaginationWithIcon
              totalPages={totalPages}
              initialPage={1}
              onPageChange={handlePageChange}
            />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 order-3">
              Affichage de {paginatedPayments.length} sur {filteredPayments.length} paiements
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DueToPayments;
