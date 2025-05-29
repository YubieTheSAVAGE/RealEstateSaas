"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { getRecentActivity } from "./activityService";
import { useRouter } from "next/navigation";
import { FallingLines } from "react-loader-spinner";

// Define the TypeScript interface for the apartment activity
interface ApartmentActivity {
  id: number;
  number: number;
  floor: number;
  type: string;
  area: number;
  price: number;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
  updatedAt: string;
  projectId: number;
  project: {
    id: number;
    name: string;
    image: string;
  };
  client?: {
    id: number;
    name: string;
    email: string;
  };
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ApartmentActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      try {
        setLoading(true);
        const data = await getRecentActivity(5);
        setActivities(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch recent activities:", err);
        setError("Failed to load recent activities");
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  // Format property type for display
  const formatPropertyType = (apartment: ApartmentActivity) => {
    const propertyType = apartment.type === 'APARTMENT' 
      ? 'Apartment' 
      : apartment.type === 'DUPLEX' 
        ? 'Duplex' 
        : apartment.type === 'VILLA' 
          ? 'Villa' 
          : apartment.type;
    
    return `${propertyType} - Floor ${apartment.floor} (${apartment.area}m²)`;
  };

  // Map API status to UI status
  // const mapStatus = (status: string): "Sold" | "Reserved" | "Available" => {
  //   switch (status) {
  //     case "SOLD": return "Sold";
  //     case "RESERVED": return "Reserved";
  //     default: return "Available";
  //   }
  // };

  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Activité récente
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setLoading(true);
              getRecentActivity(5)
                .then(data => {
                  setActivities(data);
                  setError(null);
                })
                .catch(err => {
                  console.error("Failed to refresh activities:", err);
                  setError("Failed to refresh activities");
                })
                .finally(() => setLoading(false));
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            disabled={loading}
          >
            <svg 
              className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Actualiser
          </button>
          <button
            onClick={() => router.push("/properties")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Voir tout
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        {loading ? (
          <div className="flex w-full items-center justify-center py-4">
            <FallingLines
              height="30"
              width="30"
              color="#4460FF"
              visible={loading}
            />
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500 dark:text-red-400">
            {error}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            Aucune activité récente trouvée.
          </div>
        ) : (
          <Table>
            {/* Table Header */}
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  project
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  type
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Prix
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Statu
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {activities.map((activity) => (
                <TableRow key={activity.id} className="">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      {/* {activity.project.image && (
                        <div className="h-[50px] w-[50px] overflow-hidden rounded-md">                          <Image
                            width={50}
                            height={50}
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/uploads/${activity.project.image}`}
                            className="h-[50px] w-[50px] object-cover"
                            alt={activity.project.name}
                          />
                        </div>
                      )} */}
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {activity.project.name}
                        </p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {activity.client?.name || 'No client assigned'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {formatPropertyType(activity)}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {activity.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "MAD",
                    })}
                  </TableCell>
                  <TableCell className=" py-4 font-normal text-gray-800 text-theme-sm dark:text-gray-400 whitespace-nowrap ">
                    <Badge
                      variant="light"
                      color={
                        activity.status === "AVAILABLE"
                          ? "success"
                          : activity.status === "RESERVED"
                          ? "warning"
                          : "error"
                      }
                      size="sm"
                    >
                      {activity.status === "AVAILABLE" && (
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
                      {activity.status === "RESERVED" && (
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
                      {activity.status === "SOLD" && (
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
                    // {activity.status.toLowerCase()}
                      )}
                      {activity.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
