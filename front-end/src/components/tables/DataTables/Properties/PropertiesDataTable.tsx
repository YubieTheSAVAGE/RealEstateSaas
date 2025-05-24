"use client";
import { Md3dRotation } from "react-icons/md";
import { FaEye, FaPen } from "react-icons/fa";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import {
  AngleDownIcon,
  AngleUpIcon,
  PencilIcon,
  TrashBinIcon,
} from "../../../../icons";
import PaginationWithButton from "./PaginationWithButton";
import Badge from "@/components/ui/badge/Badge";

type SortKey = "id" | "project" | "type" | "superficie" | "price" | "status" | "pricePerM2" | "zone" | "etage";
type SortOrder = "asc" | "desc";

import getApartements from "./getApartements";
import EditPropertyModal from "@/components/example/ModalExample/EditApartmentsModal";
import DeleteModal from "@/components/example/ModalExample/DeleteModal";
import { useRouter } from "next/navigation";
import deleteApartement from "./deleteApartement";

interface PropertiesDataTable {
  projects: any[];
  onRefresh?: () => void; // Callback to refresh projects data
}

type ProjectData = {
  id: string;
  project: string;
  type: string;
  superficie: string;
  price: number;
  status: string;
  pricePerM2 ?: number;
  zone ?: string;
  etage ?: string;
  client ?: []; 
};

export default function PropertiesDataTable({ apartmentsData, onRefresh }: { apartmentsData: ProjectData[]; onRefresh?: () => void; }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
    // Define the ProjectData type

  const type =
  {
    "APARTMENT": "Appartement",
    "VILLA": "Villa",
    "BUREAU": "Bureau",
    "STORE": "Magasin",
    "LAND": "Terrain",
    "AUTRE": "Autre",
  }

    
  const [apartementsData, setApartementsData] = useState<ProjectData[]>([]);
  useEffect(() => {
      // Check if data exists and is an array before mapping
      if (apartmentsData && Array.isArray(apartmentsData)) {
          const formattedData = apartmentsData.map((item: any) => ({
              id: item.id || '',
              project: item.project?.name || '', // Use optional chaining
              projectId: item.project?.id || '', // Use optional chaining
              type: item.type, // Set default or extract from your data
              superficie: `${item.area || 0} m²`, // Add fallback for area
              price: item.price || 0, // Add fallback for price
              status: item.status || 'Available',
              pricePerM2: item.pricePerM2 || 0,
              zone: item.zone || 'Unknown',
              floor: item.floor || '',
              number: item.number || 'Unknown',
              threeDViewUrl: item.threeDViewUrl || '',
              notes: item.notes || '',
              area:  item.area || 0,
              client: item.client || [], // Add client data
          }));
          setApartementsData(formattedData);
      } else {
          // If data is undefined or not an array, set empty array
          setApartementsData([]);
      }
  }, [apartmentsData]);

  const totalItems = apartementsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleDelete = async (id: string) => {
    // Implement delete logic here
    console.log("Delete item with id:", id);
    await deleteApartement(id)
    // Call onRefresh if provided to refresh the data after deletion
    if (onRefresh) {
      onRefresh();
    }
  };  

  // Filter data based on search term
  const filteredData = apartementsData.filter((item) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      item.project?.toLowerCase().includes(searchValue)
    );
  });

  // Sort filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortKey === "price" || sortKey === "pricePerM2") {
      const valueA = a[sortKey] || 0;
      const valueB = b[sortKey] || 0;
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    } else {
      const valueA = String(a[sortKey] || "").toLowerCase();
      const valueB = String(b[sortKey] || "").toLowerCase();
      return sortOrder === "asc"
        ? valueA.localeCompare(valueA)
        : valueB.localeCompare(valueB);
    }
  });

  const totalFilteredItems = filteredData.length;
  const totalFilteredPages = Math.ceil(totalFilteredItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalFilteredItems);
  const currentData = sortedData.slice(startIndex, endIndex);

  return (
    <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03]">
      <div className="flex flex-col gap-2 px-4 py-4 border border-b-0 border-gray-100 dark:border-white/[0.05] rounded-t-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 dark:text-gray-400"> Show </span>
          <div className="relative z-20 bg-transparent">
            <select
              className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              {[5, 8, 10].map((value) => (
                <option
                  key={value}
                  value={value}
                  className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                >
                  {value}
                </option>
              ))}
            </select>
            <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
              <svg
                className="stroke-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <span className="text-gray-500 dark:text-gray-400"> entries </span>
        </div>

        <div className="relative">
          <button className="absolute text-gray-500 -translate-y-1/2 left-4 top-1/2 dark:text-gray-400">
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                fill=""
              />
            </svg>
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when search term changes
            }}
            placeholder="Search..."
            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
          />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div>
          <Table>
            <TableHeader className="border-t border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  { key: "project", label: "Project" },
                  { key: "type", label: "Type" },
                  { key: "superficie", label: "Superficie" },
                  { key: "pricePerM2", label: "Price Per M²" },
                  { key: "zone", label: "Zone" },
                  { key: "price", label: "Price" },
                  { key: "status", label: "Status" },
                ].map(({ key, label }) => (
                  <TableCell
                    key={key}
                    isHeader
                    className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => handleSort(key as SortKey)}
                    >
                      <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                        {label}
                      </p>
                      <button className="flex flex-col gap-0.5">
                        <AngleUpIcon
                          className={`text-gray-300 dark:text-gray-700 ${
                            sortKey === key && sortOrder === "asc"
                              ? "text-brand-500"
                              : ""
                          }`}
                        />
                        <AngleDownIcon
                          className={`text-gray-300 dark:text-gray-700 ${
                            sortKey === key && sortOrder === "desc"
                              ? "text-brand-500"
                              : ""
                          }`}
                        />
                      </button>
                    </div>
                  </TableCell>
                ))}
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                >
                  <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                    Action
                  </p>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              )}
              {currentData.map((item, i) => (
                <TableRow key={i + 1}>
                  <TableCell className="px-4 py-4 font-medium text-gray-800 border border-gray-100 dark:border-white/[0.05] dark:text-white text-theme-sm whitespace-nowrap ">
                    {item.project}
                  </TableCell>
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                    {type[item.type as keyof typeof type] || item.type}
                  </TableCell>
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                    {item.superficie}
                  </TableCell>
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                    {(item.pricePerM2 ?? 0).toLocaleString("en-US", {
                      style: "currency",
                      currency: "MAD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </TableCell>
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                    {item.zone}
                  </TableCell>
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border dark:border-white/[0.05] border-gray-100 text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                    {item.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "MAD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </TableCell>
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100  dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                    <Badge
                      variant="light"
                      color={
                        item.status === "AVAILABLE"
                          ? "success"
                          : item.status === "RESERVED"
                          ? "warning"
                          : "error"
                      }
                      size="sm"
                    >
                      {item.status === "AVAILABLE" && (
                        <span className="text-success-500">
                          <svg
                            className="w-3 h-3 mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                        </span>
                      )}
                      {item.status === "RESERVED" && (
                        <span className="text-warning-500">
                          <svg
                            className="w-3 h-3 mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                        </span>
                      )}
                      {item.status === "SOLD" && (
                        <span className="text-error-500">   
                          <svg
                            className="w-3 h-3 mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                        </span>
                    // {item.status.toLowerCase()}
                      )}
                      {item.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap ">
                    <div className="flex items-center w-full gap-2 justify-center">
                      <button
                         className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-600"
                         onClick={() => {router.push(`/properties/${item.id}`)}}
                      >
                        <FaEye />
                      </button>
                      <DeleteModal heading="Delete Property" itemId={item.id} description="Are you sure you want to delete this property?" onDelete={() => handleDelete(item.id)} />
                      {/* <button className="text-gray-500 hover:text-warning-400 dark:text-gray-400 dark:hover:text-warning-400"> */}
                      <EditPropertyModal
                        PropertyData={item}
                        onRefresh={onRefresh}
                      />
                      {/* </button> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

    {currentData.length > 0 && (
      <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
          {/* Left side: Showing entries */}

          <PaginationWithButton
            totalPages={totalPages}
            initialPage={currentPage}
            onPageChange={handlePageChange}
          />
          <div className="pt-3 xl:pt-0">
            <p className="pt-3 text-sm font-medium text-center text-gray-500 border-t border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-t-0 xl:pt-0 xl:text-left">
              Showing {startIndex + 1} to {endIndex} of {totalItems} entries
            </p>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
