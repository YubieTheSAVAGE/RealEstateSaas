import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";

// Define the TypeScript interface for the table rows
interface Activity {
  id: number; // Unique identifier for each product
  project: string; // Product name
  agent: string; // Number of variants (e.g., "1 Variant", "2 Variants")
  type: string; // Category of the product
  price: number; // Price of the product (as a string with currency symbol)
  status: "Sold" | "Reserved" | "Available"; // Status of the product
}

// Define the table data using the interface
const tableData: Activity[] = [
  {
    id: 1,
    project: "Royal Gardens Residences",
    agent: "John Doe",
    type: "Apartment - 3Br/2BA (86m²)",
    price: 1915030,
    status: "Sold",
  },
  {
    id: 2,
    project: "Sunset Villas",
    agent: "Jane Smith",
    type: "Villa - 4Br/3BA (120m²)",
    price: 2799990,
    status: "Reserved",
  },
  {
    id: 3,
    project: "Ocean View Apartments",
    agent: "Michael Johnson",
    type: "Apartment - 2Br/2BA (75m²)",
    price: 1299990,
    status: "Available",
  },
  {
    id: 4,
    project: "Mountain Retreat",
    agent: "Emily Davis",
    type: "Cottage - 3Br/2BA (95m²)",
    price: 1599990,
    status: "Sold",
  },
  {
    id: 5,
    project: "City Center Condos",
    agent: "Sarah Wilson",
    type: "Condo - 1Br/1BA (50m²)",
    price: 799990,
    status: "Available",
  },
];

export default function RecentOrders() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Activity
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
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
                Project
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

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((activity) => (
              <TableRow key={activity.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    {/* <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <Image
                        width={50}
                        height={50}
                        src={activity.image}
                        className="h-[50px] w-[50px]"
                        alt={activity.name}
                      />
                    </div> */}
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {activity.project}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {activity.agent}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {activity.type}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {activity.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "MAD",
                  })}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      activity.status === "Sold"
                        ? "success"
                        : activity.status === "Reserved"
                        ? "warning"
                        : "light"
                    }
                  >
                    {activity.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
