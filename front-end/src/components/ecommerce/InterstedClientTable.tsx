import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
// import PropertiesListDropdownFilter from "../example/DropdownExample/PropertiesListDropdownFilter";
import { Client } from "@/types/client";
import Badge from "../ui/badge/Badge";
import { FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function InterestedClientTable({ ClientDetails }: { ClientDetails: Client[] }) {
  const router = useRouter();
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Clients intéressés
          </h3>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* En-tête du tableau */}
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
                Email
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Téléphone
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

          {/* Corps du tableau */}
          <TableBody>
            {ClientDetails.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {client.name}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {client.email ? client.email : "N/A"}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {client.phoneNumber ? client.phoneNumber : "N/A"}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge size="sm" color={client.status === "CLIENT" ? "primary" : "info"} variant="light">
                    {client.status.toLocaleLowerCase() === "client" ? "Client" : "Prospect"}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <FaEye
                    className="text-gray-600 hover:text-blue-600 dark:hover:text-gray-300 cursor-pointer"
                    onClick={() => {
                      router.push(`/clients/${client.id}`);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
