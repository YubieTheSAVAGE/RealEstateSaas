"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import PaymentsDropdownFilter, { PaymentsFilters } from "../example/DropdownExample/PaymentsDropdownFilter";
import { Payment } from "@/types/Payment";
import { FaDownload, FaEye } from "react-icons/fa";
import PaginationWithIcon from "../ui/pagination/PaginationWitIcon";
import { useState, useMemo, useEffect } from "react";
import { PropertyFilters } from "../example/DropdownExample/PropertiesListDropdownFilter";

interface PaymentsTableProps {
  payments: Payment[];
}

const PAGE_SIZE = 3;

export default function PaymentsTable({ payments }: PaymentsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<PaymentsFilters>({
    pending: false,
    paid: false,
    late: false,
  });

  // Calculate pagination
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchStatus =
        (!filters.pending && !filters.paid && !filters.late) ||
        (filters.pending && payment.status?.toUpperCase() === "PENDING") ||
        (filters.paid && payment.status?.toUpperCase() === "PAID") ||
        (filters.late && payment.status?.toUpperCase() === "LATE");
      return matchStatus;
    });
  }, [payments, filters]);

  const totalPages = Math.ceil(filteredPayments.length / PAGE_SIZE);
  const currentData = filteredPayments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 whenever filters change
  }, [filters]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
           Liste des échéances
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <PaymentsDropdownFilter onFilterChange={setFilters} initialFilters={filters} />
        </div>
      </div>
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        <div className="min-w-[800px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Client
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Projet / propriété
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Montant
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Montant total
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Date d'échéance
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Statut
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredPayments && Array.isArray(filteredPayments) && filteredPayments.length > 0 ? (
                currentData.map((payment : Payment) => (                
                <TableRow key={payment.id} className="">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {payment.property.client?.name || payment.contract?.client?.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {payment.property.project.name} {payment.property.number}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {payment.amount} MAD
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {payment.property.prixTotal} MAD
                      <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {((payment.amount / payment.property.prixTotal) * 100).toFixed(1)}% du prix total
                      </p>
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {payment.dueDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          payment.status?.toUpperCase() === "PENDING"
                            ? "waiting"
                            : payment.status?.toUpperCase() === "PAID"
                            ? "success"
                            : payment.status?.toUpperCase() === "LATE"
                            ? "warning"
                            : "error"
                        }
                      >
                        {payment.status === "PENDING" ? "En attente" : payment.status === "PAID" ? "Payé" : payment.status === "LATE" ? "En retard" : "Annulé"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <FaEye />
                        <FaDownload />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-6 text-center text-gray-500 dark:text-gray-400">
                    Aucun contrat disponible
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Pagination */}
      {payments.length > 0 && totalPages > 1 && (
        <div className="w-full border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between py-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage} de {totalPages}
            </span>
            <div className="flex items-center justify-center py-0">
            <PaginationWithIcon
              totalPages={totalPages}
              initialPage={1}
              onPageChange={setCurrentPage}
            />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Affichage de {currentData.length} sur {filteredPayments.length} échéances
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
