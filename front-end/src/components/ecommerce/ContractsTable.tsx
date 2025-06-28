import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import ContractsDropdownFilter, { ContractsFilters } from "../example/DropdownExample/ContractsDropdownFilter";
import { Contract } from "@/types/Contract";
import { FaDownload, FaEye, FaSearch } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import PaginationWithIcon from "../ui/pagination/PaginationWitIcon";
import PaymentsDropdownFilter from "../example/DropdownExample/PaymentsDropdownFilter";

interface ContractsTableProps {
  contracts: Contract[];
}

const PAGE_SIZE = 10;

export default function ContractsTable({ contracts }: ContractsTableProps) {
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ContractsFilters>({
    waitingCValidation: false,
    validatedByClient: false,
    legalized: false,
    validated: false,
  });

  // Calculate pagination
  const filteredContracts = useMemo(() => {
    return contracts.filter((contract) => {
      // Status filter
      const matchStatus =
        (!filters.waitingCValidation && !filters.validatedByClient && !filters.legalized && !filters.validated) ||
        (filters.waitingCValidation && contract.status?.toUpperCase() === "WAITING_CVALIDATION") ||
        (filters.validatedByClient && contract.status?.toUpperCase() === "VALIDATED_BY_CLIENT") ||
        (filters.legalized && contract.status?.toUpperCase() === "LEGALIZED") ||
        (filters.validated && contract.status?.toUpperCase() === "VALIDATED");

      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchSearch = !searchTerm || 
        contract.property.project.name.toLowerCase().includes(searchLower) ||
        contract.property.number.toLowerCase().includes(searchLower) ||
        (contract.property.client?.name || "").toLowerCase().includes(searchLower) ||
        (contract.client?.name || "").toLowerCase().includes(searchLower);

      return matchStatus && matchSearch;
    });
  }, [contracts, filters, searchTerm]);

  const totalPages = Math.ceil(filteredContracts.length / PAGE_SIZE);
  const currentData = filteredContracts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatDate = (date: Date) => {
    if (!isClient) {
      return ''; // Return empty string during SSR to prevent hydration mismatch
    }
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
           Liste des contrats
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="client, numéro ou projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 w-64"
            />
          </div>
          <ContractsDropdownFilter onFilterChange={setFilters} initialFilters={filters} />
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
                  Template
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
                  Date de génération
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
              {filteredContracts && Array.isArray(filteredContracts) && filteredContracts.length > 0 ? (
                currentData.map((contract : Contract) => (                
                <TableRow key={contract.id} className="">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {contract.client.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {contract.property.project.name} {contract.property.number}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {contract.template.name}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {contract.property.prixTotal} MAD
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {formatDate(contract.createdAt)}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          contract.status?.toUpperCase() === "WAITING_CVALIDATION"
                            ? "waiting"
                            : contract.status?.toUpperCase() === "VALIDATED_BY_CLIENT"
                            ? "warning"
                            : contract.status?.toUpperCase() === "LEGALIZED"
                            ? "info"
                            : "success"
                        }
                      >
                        {contract.status === "WAITING_CVALIDATION" ? "En attente" : contract.status === "VALIDATED_BY_CLIENT" ? "Validé par le client" : contract.status === "LEGALIZED" ? "Légalisé" : "Validé"}
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
                  <TableCell colSpan={6} className="py-6 text-center text-gray-500 dark:text-gray-400">
                    Aucun contrat disponible
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* Pagination */}
      {filteredContracts.length > 0 && totalPages > 1 && (
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
              Affichage de {currentData.length} sur {filteredContracts.length} contrats
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
