"use client";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { MoreDotIcon } from "@/icons";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import MonthlyTargetModal from "../example/ModalExample/MonthlyTargetModal";
import getMonthlyTarget from "../example/ModalExample/getMonthlyTarget";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface MonthlyTargetData {
  id: number;
  target: number;
  startDate: string;
  endDate: string;
}

interface RevenueData {
  totalRevenue: number;
  dailyRevenue: number;
  growthRate: number;
}

import getApartements from "../tables/DataTables/Properties/getApartements";
import { Property } from "@/types/property";
import { FallingLines } from "react-loader-spinner";
export default function MonthlyTarget({ userRole }: { userRole: string | null }) {
  const [targetData, setTargetData] = useState<MonthlyTargetData | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData>({
    totalRevenue: 0,
    dailyRevenue: 0,
    growthRate: 0,
  });
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // const [targetDirection, setTargetDirection] = useState<'up' | 'down' | null>(null);
  const [revenueDirection, setRevenueDirection] = useState<'up' | 'down' | null>(null);
  const [todayDirection, setTodayDirection] = useState<'up' | 'down' | null>(null);

  const fetchRevenueData = async () => {
    const data = await getApartements();
    const today = new Date();

    // Calculate the first day of current and previous month
    const firstDayCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    // Calculate today and yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Current month's revenue (for the monthly calculation)
    const currentMonthRevenue = data.reduce((acc: number, apartment: Property) => {
      if (apartment.status === "SOLD") {
        const saleDate = new Date(apartment.updatedAt || "");
        if (saleDate >= firstDayCurrentMonth && saleDate <= today) {
          return acc + apartment.prixTotal;
        }
      }
      return acc;
    }, 0);

    // Previous month's revenue
    const previousMonthRevenue = data.reduce((acc: number, apartment: Property) => {
      if (apartment.status === "SOLD") {
        const saleDate = new Date(apartment.updatedAt || "");
        if (saleDate >= firstDayPreviousMonth && saleDate <= lastDayPreviousMonth) {
          return acc + apartment.prixTotal;
        }
      }
      return acc;
    }, 0);

    // Today's revenue
    const dailyRevenue = data.reduce((acc: number, apartment: Property) => {
      if (apartment.status === "SOLD") {
        const saleDate = new Date(apartment.updatedAt || "");
        if (saleDate.toDateString() === today.toDateString()) {
          return acc + apartment.prixTotal;
        }
      }
      return acc;
    }, 0);

    // Yesterday's revenue for comparison
    const yesterdayRevenue = data.reduce((acc: number, apartment: Property) => {
      if (apartment.status === "SOLD") {
        const saleDate = new Date(apartment.updatedAt || "");
        if (saleDate.toDateString() === yesterday.toDateString()) {
          return acc + apartment.prixTotal;
        }
      }
      return acc;
    }, 0);

    // Calculate growth rates and directions
    const monthlyGrowthRate = previousMonthRevenue > 0
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
      : (currentMonthRevenue > 0 ? 100 : 0);

    setRevenueDirection(currentMonthRevenue >= previousMonthRevenue ? 'up' : 'down');
    setTodayDirection(dailyRevenue >= yesterdayRevenue ? 'up' : 'down');
    console.log("Current Month Revenue:", currentMonthRevenue);
    console.log("Previous Month Revenue:", previousMonthRevenue);
    console.log("Daily Revenue:", dailyRevenue);
    console.log("Yesterday Revenue:", yesterdayRevenue);
    console.log("Monthly Growth Rate:", monthlyGrowthRate);
    console.log("Revenue Direction:", revenueDirection);
    console.log("Today Direction:", todayDirection);
    // Set the revenue data state
    setRevenueData({
      totalRevenue: currentMonthRevenue,
      dailyRevenue: dailyRevenue,
      growthRate: parseFloat(monthlyGrowthRate.toFixed(1))
    });
  }
  useEffect(() => {
    fetchRevenueData();
  }, []);

  // Series for the chart (progress percentage)
  const series = [progress];

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val.toFixed(1) + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // Function to handle data refresh after new target is added
  const handleTargetAdded = () => {
    // Increment the refresh trigger to cause a data refetch
    setRefreshTrigger((prev) => prev + 1);
  };

  // Fetch user role and target data
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch user role

        // Fetch monthly target data
        const monthlyTargetData = await getMonthlyTarget();
        if (monthlyTargetData) {
          setTargetData(monthlyTargetData);

          // Calculate progress percentage when we have both target and revenue data
          if (monthlyTargetData.target && revenueData.totalRevenue) {
            const progressPercent = (revenueData.totalRevenue / monthlyTargetData.target) * 100;
            setProgress(Math.min(progressPercent, 100)); // Cap at 100%

            // Calculate growth rate as well
            const chaka = monthlyTargetData.target - revenueData.dailyRevenue;
            const growthRate = ((chaka / monthlyTargetData.target) * 100);
            setRevenueData(prev => ({
              ...prev,
              growthRate: parseFloat(growthRate.toFixed(1))
            }));
          }
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [refreshTrigger, revenueData.totalRevenue]);

  // Update progress and growth rate whenever revenue or target changes
  useEffect(() => {
    if (targetData?.target && revenueData.totalRevenue) {
      const progressPercent = (revenueData.totalRevenue / targetData.target) * 100;
      setProgress(Math.min(progressPercent, 100)); // Cap at 100%
      // Compare revenue to target to set target direction
      // setTargetDirection(revenueData.totalRevenue >= targetData.target ? 'up' : 'down');
      // Calculate growth rate
      const remainingToTarget = targetData.target - revenueData.totalRevenue;
      const growthRate = ((remainingToTarget / targetData.target) * 100);

      setRevenueData(prev => ({
        ...prev,
        growthRate: parseFloat((100 - growthRate).toFixed(1)) // Show achievement percentage instead
      }));
    }
  }, [targetData, revenueData.totalRevenue]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Objectif mensuel
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              {targetData
                ? `Période de l'objectif : ${new Date(
                  targetData.startDate
                ).toLocaleDateString()} - ${new Date(
                  targetData.endDate
                ).toLocaleDateString()}`
                : "Objectif que vous avez défini pour chaque mois"}
            </p>
          </div>
          {userRole === "ADMIN" && (
            <div className="relative h-fit">
              <button onClick={toggleDropdown} className="dropdown-toggle">
                <MoreDotIcon />
              </button>
              <Dropdown
                isOpen={isOpen}
                onClose={closeDropdown}
                className="w-40 p-2"
              >
                <MonthlyTargetModal
                  closeDropdown={closeDropdown}
                  onTargetAdded={handleTargetAdded}
                  targetData={targetData ?? undefined}
                />
              </Dropdown>
            </div>
          )}
        </div>
        <div className="relative">
          {loading ? (
            <div className="flex h-[200px] w-full items-center justify-center">
              <FallingLines
                height="80"
                width="80"
                color="#4460FF"
                visible={loading}
              />
            </div>
          ) : (
            <div className="max-h-[330px]" id="chartDarkStyle">
              <ReactApexChart
                options={options}
                series={series}
                type="radialBar"
                height={330}
              />
            </div>
          )}

          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            {revenueData.growthRate > 0 ? "+" : ""}
            {revenueData.growthRate}%
          </span>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          Vous avez gagné{" "}
          {revenueData.dailyRevenue.toLocaleString("fr-FR", {
            style: "currency",
            currency: "MAD",
          })}{" "}
          aujourd&apos;hui
          {revenueData.growthRate > 0
            ? ", c'est plus élevé que le mois dernier. Continuez votre bon travail !"
            : "."}
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Objectif
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {targetData ? formatCurrency(targetData.target) : "N/A"}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Chiffre d&apos;affaires
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {formatCurrency(revenueData.totalRevenue)}
            {revenueDirection && (
              revenueDirection === 'up' ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                    fill="#039855"
                  />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176 7.8311 13.9176C7.83148 13.9176 7.83187 13.9176 7.83226 13.9176C8.02445 13.9178 8.21671 13.8447 8.36339 13.6981L12.3635 9.70076C12.6565 9.40797 12.6567 8.9331 12.3639 8.6401C12.0711 8.34711 11.5962 8.34694 11.3032 8.63973L8.5811 11.36L8.5811 2.5C8.5811 2.08579 8.24531 1.75 7.8311 1.75C7.41688 1.75 7.0811 2.08579 7.0811 2.5L7.0811 11.3556L4.36354 8.63975C4.07055 8.34695 3.59568 8.3471 3.30288 8.64009C3.01008 8.93307 3.01023 9.40794 3.30321 9.70075L7.26816 13.6632Z"
                    fill="#D92D20"
                  />
                </svg>
              )
            )}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Aujourd&apos;hui
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {formatCurrency(revenueData.dailyRevenue)}
            {todayDirection && (
              todayDirection === 'up' ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                    fill="#039855"
                  />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176 7.8311 13.9176C7.83148 13.9176 7.83187 13.9176 7.83226 13.9176C8.02445 13.9178 8.21671 13.8447 8.36339 13.6981L12.3635 9.70076C12.6565 9.40797 12.6567 8.9331 12.3639 8.6401C12.0711 8.34711 11.5962 8.34694 11.3032 8.63973L8.5811 11.36L8.5811 2.5C8.5811 2.08579 8.24531 1.75 7.8311 1.75C7.41688 1.75 7.0811 2.08579 7.0811 2.5L7.0811 11.3556L4.36354 8.63975C4.07055 8.34695 3.59568 8.3471 3.30288 8.64009C3.01008 8.93307 3.01023 9.40794 3.30321 9.70075L7.26816 13.6632Z"
                    fill="#D92D20"
                  />
                </svg>
              )
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to format currency with proper unit (K, M, B)
function formatCurrency(value: number): string {
  if (value === 0) return "0 MAD";

  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B MAD`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M MAD`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K MAD`;
  }

  return `${value?.toFixed(0) ?? 0} MAD`;
}
