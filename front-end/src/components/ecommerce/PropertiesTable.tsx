import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import PropertiesListDropdownFilter from "../example/DropdownExample/PropertiesListDropdownFilter";
import getProjectById from "../project/getProjectById"; // Adjust the import path as necessary
import { use, useEffect, useState } from "react";


// Define the TypeScript interface for the table rows
interface Product {
  id: number; // Unique identifier for each product
  name: string; // Product name
  variants: string; // Number of variants (e.g., "1 Variant", "2 Variants")
  category: string; // Category of the product
  price: string; // Price of the product (as a string with currency symbol)
  // status: string; // Status of the product
  image: string; // URL or path to the product image
  status: "Delivered" | "Pending" | "Canceled"; // Status of the product
}

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

export default function PropertiesTable({ ProjectDetails }: { ProjectDetails: any }) {

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Available Properties
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
            <TableRow>              <TableCell
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
              ProjectDetails.map((product : any) => (                <TableRow key={product.id} className="">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {(type[product.type as keyof typeof type] || product.name || product.title) + " " + (product.number || "") +  " (" + product.floor + ")"}
                        </p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {type[product.type as keyof typeof type] || product.variants || "Standard"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {type[product.type as keyof typeof type] || product.type || "Residential"}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {product.price ? `$${product.price}` : 'N/A'}
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
