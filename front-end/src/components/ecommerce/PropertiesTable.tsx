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

export default function PropertiesTable({ ProjectDetails }: { ProjectDetails: any[] }) {
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

  // Apply filters to properties
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
            Available Properties
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
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Property</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Type</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Price</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {currentData.length > 0 ? (
              currentData.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {(typeMap[product.type as keyof typeof typeMap] || product.name || product.title) + " " + (product.number || "") + " (" + product.floor + ")"}
                        </p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {typeMap[product.type as keyof typeof typeMap] || product.variants || "Standard"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {typeMap[product.type as keyof typeof typeMap] || product.type || "Residential"}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {product.price ? `$${product.price}` : "N/A"}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        product.status === "AVAILABLE" || product.status === "Available"
                          ? "success"
                          : product.status === "RESERVED" || product.status === "Reserved"
                            ? "warning"
                            : "error"
                      }
                    >
                      {product.status || "Unknown"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center text-gray-500 dark:text-gray-400">
                  No properties match the selected filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center text-center justify-between mt-4">
          <PaginationWithIcon
            totalPages={totalPages}
            initialPage={1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
