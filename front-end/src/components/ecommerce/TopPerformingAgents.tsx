"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";
import { getTopPerformingAgents } from "./agentsService";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

// Define the TypeScript interface for the agent data
interface Agent {
  id: number;
  name: string;
  level: string;
  project: string;
  salesRevenue: number;
  monthlySales: number;
  image: string;
}

export default function PerformingAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchAgents() {
    try {
      setLoading(true);
      setError(null);
      const data = await getTopPerformingAgents(5);
      setAgents(data);
    } catch (err) {
      console.error("Error fetching agents:", err);
      setError("Failed to load top performing agents");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAgents();
  }, []);
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Top Performing Agents
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchAgents}
            disabled={loading}
            className="inline-flex items-center gap-2 font-medium"
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </Button>
          <button
            onClick={() => router.push("/agents")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            See all
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-error-500">
            <p>{error}</p>
            <Button
              variant="outline"
              onClick={fetchAgents}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No data available</p>
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
                  Agent
                </TableCell>
                {/* <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Project
                </TableCell> */}
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Sales revenue
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Monthly Sales
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {agents.map((agent) => (
                <TableRow key={agent.id} className="">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      {/* <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                        <Image
                          width={50}
                          height={50}
                          src={agent.image}
                          className="h-[50px] w-[50px]"
                          alt={agent.name}
                        />
                      </div> */}
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {agent.name}
                        </p>
                        {/* <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {agent.level}
                        </span> */}
                      </div>
                    </div>
                  </TableCell>
                  {/* <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {agent.project}
                  </TableCell> */}
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {agent.salesRevenue.toLocaleString("en-US", {
                      style: "currency",
                      currency: "MAD",
                    })}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {agent.monthlySales < 0 ? (
                      <Badge color="error">
                        <ArrowDownIcon className="text-error-500" />
                        {Math.abs(agent.monthlySales).toFixed(2)}%
                      </Badge>
                    ) : (
                      <Badge color="success">
                        <ArrowUpIcon className="text-success-500" />
                        {agent.monthlySales.toFixed(2)}%
                      </Badge>
                    )}
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
