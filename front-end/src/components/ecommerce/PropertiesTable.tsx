import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import PropertiesListDropdownFilter, { PropertyFilters } from "../example/DropdownExample/PropertiesListDropdownFilter";
import { useEffect, useMemo, useState } from "react";
import PaginationWithIcon from "../ui/pagination/PaginationWitIcon";
import { FaEye } from "react-icons/fa";
import { Property } from "@/types/property";
import { useRouter } from "next/navigation";

const typeMap = {
  APARTMENT: "Appartement",
  VILLA: "Villa",
  PENTHOUSE: "Penthouse",
  STUDIO: "Studio",
  LOFT: "Loft",
  DUPLEX: "Duplex",
  TRIPLEX: "Triplex",
  TOWNHOUSE: "Maison de ville",
  BUNGALOW: "Bungalow",
  STORE: "Magasin",
  LAND: "Terrain",
};

const PAGE_SIZE = 10;

export default function PropertiesTable({ ProjectDetails }: { ProjectDetails: Property[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<PropertyFilters>({
    available: false,
    reserved: false,
    sold: false,
    apartment: false,
    villa: false,
    duplex: false,
    store: false,
    land: false,
  });
  const router = useRouter();

  // Appliquer les filtres to properties
  const filteredProperties = useMemo(() => {
    return ProjectDetails.filter((property) => {
      const matchStatus =
        (!filters.available && !filters.reserved && !filters.sold) ||
        (filters.available && property.status?.toUpperCase() === "AVAILABLE") ||
        (filters.reserved && property.status?.toUpperCase() === "RESERVED") ||
        (filters.sold && property.status?.toUpperCase() === "SOLD");

      const matchType =
        (!filters.apartment &&
          !filters.villa &&
          !filters.duplex &&
          !filters.store &&
          !filters.land) ||
        (filters.apartment && property.type === "APARTMENT") ||
        (filters.villa && property.type === "VILLA") ||
        (filters.duplex && property.type === "DUPLEX") ||
        (filters.store && property.type === "STORE") ||
        (filters.land && property.type === "LAND");

      return matchStatus && matchType;
    });
  }, [ProjectDetails, filters]);

  const totalPages = Math.ceil(filteredProperties.length / PAGE_SIZE);
  const currentData = filteredProperties.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 whenever filters change
  }, [filters]);

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Propriétés disponibles
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <PropertiesListDropdownFilter onFilterChange={setFilters} initialFilters={filters} />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Propriété</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Type</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Prix</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Statut</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {currentData.length > 0 ? (
              currentData.map((product: Property) => (
                <TableRow key={product.id}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {(typeMap[product.type as keyof typeof typeMap] || product.project.name) + " " + (product.number || "") + " (" + product.floor + ")"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {typeMap[product.type as keyof typeof typeMap] || product.type || "Residential"}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {product.prixTotal ? `${product.prixTotal} MAD` : "N/A"}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        product.status?.toUpperCase() === "AVAILABLE"
                          ? "success"
                          : product.status?.toUpperCase() === "RESERVED"
                            ? "warning"
                            : "error"
                      }
                    >
                      {product.status === "AVAILABLE" ? "Disponible" : product.status === "RESERVED" ? "Réservé" : "Vendu"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-500 hover:underline" onClick={() => router.push(`/properties/${product.id}`)}>
                        <FaEye />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center text-gray-500 dark:text-gray-400">
                  Aucune propriété ne correspond aux filtres sélectionnés
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {currentData.length > 0 && (
          <div className="w-full border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between py-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} de {totalPages}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Affichage de {currentData.length} sur {filteredProperties.length} propriété
              </span>
            </div>
              <div className="flex items-center justify-center py-0">
              <PaginationWithIcon
                totalPages={totalPages}
                initialPage={1}
                onPageChange={setCurrentPage}
              />
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
