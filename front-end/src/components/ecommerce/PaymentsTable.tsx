import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import PropertiesListDropdownFilter from "../example/DropdownExample/PropertiesListDropdownFilter";
import { Contract } from "@/types/Contract";
import { FaDownload, FaEye } from "react-icons/fa";

interface ContractsTableProps {
  contracts: Contract[];
}

export default function ContractsTable({ contracts }: ContractsTableProps) {

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
           Liste des contrats
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <PropertiesListDropdownFilter />
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
              {contracts && Array.isArray(contracts) && contracts.length > 0 ? (
                contracts.map((contract : Contract) => (                
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
                      {contract.property.price} MAD
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {contract.createdAt.toLocaleDateString()}
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
                        {contract.status === "WAITING_CVALIDATION" ? "En attente" : contract.status === "VALIDATED_BY_CLIENT" ? "Validé par le client" : contract.status === "LEGALIZED" ? "Validé par le notaire" : "Validé"}
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
    </div>
  );
}
