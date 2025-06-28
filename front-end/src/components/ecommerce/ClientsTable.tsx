import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import PropertiesListDropdownFilter from "../example/DropdownExample/PropertiesListDropdownFilter";
import { Property } from "@/types/property";

const type = {
  "APARTMENT": "Appartement",
  "VILLA": "Villa", 
  "PENTHOUSE": "Penthouse",
  "STUDIO": "Studio",
  "LOFT": "Loft",
  "DUPLEX": "Duplex",
  "TRIPLEX": "Triplex", 
  "TOWNHOUSE": "Maison de ville",
  "BUNGALOW": "Bungalow",
  "STORE": "Magasin",
  "LAND": "Terrain",
};

export default function ClientsTable({ ProjectDetails }: { ProjectDetails: Property[] }) {

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
           Propriétés disponibles
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <PropertiesListDropdownFilter />
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Property
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Type
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Price
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {ProjectDetails && Array.isArray(ProjectDetails) && ProjectDetails.length > 0 ? (
              ProjectDetails.map((product : Property) => (                <TableRow key={product.id} className="">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {(type[product.type as keyof typeof type] || product.project.name) + " " + (product.number || "") +  " (" + product.floor + ")"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {type[product.type as keyof typeof type] || product.type || "Residential"}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {product.prixTotal ? `${product.prixTotal}` : 'N/A'}
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
                      {product.status || "Unknown"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center text-gray-500 dark:text-gray-400">
                  No properties available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
