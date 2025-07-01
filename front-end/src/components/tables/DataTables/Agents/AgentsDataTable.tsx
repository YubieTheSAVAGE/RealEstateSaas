"use client";
import { useState, } from "react";
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
} from "../../../../icons";
import PaginationWithButton from "./PaginationWithButton";
import { useEffect } from "react";
import { FaEye } from "react-icons/fa";
import DeleteModal from "@/components/example/ModalExample/DeleteModal";
import EditAgentModal from "@/components/example/ModalExample/EditAgentModal";
import { useRouter } from "next/navigation";
import deleteAgents from "./deleteAgents";
import { Agent as BaseAgent } from "@/types/Agent";
type Agent = BaseAgent & {
  totalSales?: number;
  monthlySalesCount?: number;
};
type SortKey = "id" | "name" | "email" | "phone" | "status" | "totalSales" | "monthlySales";
type SortOrder = "asc" | "desc";


export default function AgentsDataTable({ agents, onClientEdit }: { agents: Agent[], onClientEdit: (id: number) => void }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<Agent[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(agents);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      }
    };
    fetchData();
  }, [agents]); // Add agents as a dependency to re-fetch when it changes


  useEffect(() => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
    
      const agentsWithMonthlySales = agents.map(agent => {
        if (!agent.apartments) return { ...agent, monthlySalesCount: 0 };
    
        // Count apartments sold this month based on updatedat
        const monthlySalesCount = agent.apartments.reduce((count, apartment) => {
          // Check if updatedat exists
          if (apartment.updatedAt) {
            const updatedDate = new Date(apartment.updatedAt);
            const month = updatedDate.getMonth();
            const year = updatedDate.getFullYear();
            
            if (month === currentMonth && year === currentYear) {
              return count + 1; // Increment count for each apartment updated this month
            }
          }
          return count;
        }, 0);
    
        return { ...agent, monthlySalesCount };
      });
    
      setData(agentsWithMonthlySales);
    }, [agents]);

  const handleDelete = async (id: string) => {
    // Implement the delete logic here
    // For example, you might call an API to delete the agent
    const success: boolean = await deleteAgents(id);
    if (success) {
      // Optionally, you can refresh the data after deletion
      if (onClientEdit) {
        onClientEdit(Number(id)); // Convert string id to number since onClientEdit expects a number
      }
    } else {
      console.error("Erreur lors de la suppression de l'agent avec l'ID:", id);
    }
  }


  // const filteredAndSortedData = useMemo(() => {
  //   return data
  //     .filter((item) =>
  //       Object.values(item).some(
  //         (value) =>
  //           typeof value === "string" &&
  //           value.toLowerCase().includes(searchTerm.toLowerCase())
  //       )
  //     )
  //     .sort((a, b) => {
  //       if (sortKey === "status") {
  //         const statusA = Number.parseInt(a[sortKey].replace(/\$|,/g, ""));
  //         const statusB = Number.parseInt(b[sortKey].replace(/\$|,/g, ""));
  //         return sortOrder === "asc" ? statusA - statusB : statusB - statusA;
  //       }
  //       return sortOrder === "asc"
  //         ? String(a[sortKey]).localeCompare(String(b[sortKey]))
  //         : String(b[sortKey]).localeCompare(String(a[sortKey]));
  //     });
  // }, [sortKey, sortOrder, searchTerm]);

  const totalItems = data.length;
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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = data.slice(startIndex, endIndex);

  // Table header translations
  const tableHeaders = [
    { key: "name", label: "Agent" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Téléphone" },
    { key: "status", label: "Statut" },
    { key: "totalSales", label: "Ventes totales" },
    { key: "monthlySales", label: "Ventes mensuelles" },
  ];

  return (
    <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03]">
      <div className="flex flex-col gap-2 px-4 py-4 border border-b-0 border-gray-100 dark:border-white/[0.05] rounded-t-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 dark:text-gray-400"> Afficher </span>
          <div className="relative z-0 bg-transparent">
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
          <span className="text-gray-500 dark:text-gray-400"> entrées </span>
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
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher..."
            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
          />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div>
          <Table>
            <TableHeader className="border-t border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {tableHeaders.map(({ key, label }) => (
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
                          className={`text-gray-300 dark:text-gray-700 ${sortKey === key && sortOrder === "asc"
                            ? "text-brand-500"
                            : ""
                            }`}
                        />
                        <AngleDownIcon
                          className={`text-gray-300 dark:text-gray-700 ${sortKey === key && sortOrder === "desc"
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
                    colSpan={7}
                    className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    Aucune donnée disponible
                  </TableCell>
                </TableRow>
              )}
              {data.map((item, i) => (
                <TableRow key={i + 1}>
                  <TableCell className="px-4 py-4 font-medium text-gray-800 border border-gray-100 dark:border-white/[0.05] dark:text-white text-theme-sm whitespace-nowrap ">
                    {item.name}
                  </TableCell>
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                    {item.email}
                  </TableCell>
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                    {item.phoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                    {item.status === "ACTIVE" ? (
                      <span className="text-green-500">Actif</span>
                    ) : item.status === "INACTIVE" ? (
                      <span className="text-red-500">Inactif</span>
                    ) : (
                      <span className="text-yellow-500">Inconnu</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border dark:border-white/[0.05] border-gray-100 text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                    {item.apartments?.length || 0}
                  </TableCell>
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100  dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                    {item.monthlySalesCount || 0}
                  </TableCell>
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap ">
                    <div className="flex items-center justify-center w-full gap-2">
                      <FaEye
                        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white/90 cursor-pointer"
                        onClick={() => router.push(`/agents/${item.id.toString()}`)}
                      />
                      <DeleteModal
                        itemId={item.id.toString()}
                        heading="Supprimer l'agent"
                        description={`Êtes-vous sûr de vouloir supprimer l'agent ${item.name} ?`}
                        onDelete={() => { handleDelete(item.id.toString()) }}
                      />
                      <EditAgentModal AgentDetails={item} onAgentEdited={() => onClientEdit(item.id)} />
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
            <PaginationWithButton
              totalPages={totalPages}
              initialPage={currentPage}
              onPageChange={handlePageChange}
            />
            <div className="pt-3 xl:pt-0">
              <p className="pt-3 text-sm font-medium text-center text-gray-500 border-t border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-t-0 xl:pt-0 xl:text-left">
                Affichage de {startIndex + 1} à {endIndex} sur {totalItems} entrées
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
