"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "@/icons";
import dynamic from "next/dynamic";
import { Property } from "@/types/property";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface PropertySalesData {
  type: string;
  count: number;
  percentage: number;
  displayName: string;
  color: string;
}

// Chart colors 
const CHART_COLORS = [
  "#3641f5", // Blue
  "#7592ff", // Light Blue
  "#dde9ff", // Lightest Blue
  "#f972b6", // Pink
  "#fab1d0", // Light Pink
  "#ffd166", // Yellow
  "#06d6a0", // Green
  "#4cc9f0", // Cyan
  "#9d4edd", // Purple
];

export default function PropertiesCategoryPieChart({ properties }: { properties: Property[] }) {
  const [salesData, setSalesData] = useState<PropertySalesData[]>([]);
  const [totalSoldProperties, setTotalSoldProperties] = useState(0);
  
  // Property type mapping
  const typeMapping: Record<string, string> = {
    "APARTMENT": "Appartement",
    "VILLA": "Villa", 
    "BUREAU": "Bureau",
    "STORE": "Magasin",
    "LAND": "Terrain",
    "AUTRE": "Autre",
    "DUPLEX": "Duplex",
  };

  // Process data when apartements change
  useEffect(() => {
    if (!properties || properties.length === 0) return;

    // Filter only "SOLD" properties
    const soldProperties = properties.filter(apt => apt.status === "SOLD");
    setTotalSoldProperties(soldProperties.length);

    if (soldProperties.length === 0) {
      setSalesData([]);
      return;
    }

    // Group sold properties by type
    const groupedByType: Record<string, number> = {};
    soldProperties.forEach(property => {
      const type = property.type || "AUTRE";
      groupedByType[type] = (groupedByType[type] || 0) + 1;
    });

    // Transform into array of data objects with percentages
    const typesData = Object.entries(groupedByType).map(([type, count], index) => {
      return {
        type,
        count,
        percentage: Math.round((count / soldProperties.length) * 100),
        displayName: typeMapping[type] || type,
        color: CHART_COLORS[index % CHART_COLORS.length]
      };
    });

    setSalesData(typesData);
  }, [properties]);

  // Derived chart data
  const chartLabels = useMemo(() => salesData.map(item => item.displayName), [salesData]);
  const chartSeries = useMemo(() => salesData.map(item => item.count), [salesData]);
  const chartColors = useMemo(() => salesData.map(item => item.color), [salesData]);

  // ApexCharts configuration
  const options: ApexOptions = useMemo(() => ({
    colors: chartColors,
    labels: chartLabels,
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
      width: 280,
      height: 280,
    },
    stroke: {
      show: false,
      width: 4,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 0,
              color: "#1D2939",
              fontSize: "14px",
              fontWeight: "normal",
            },
            value: {
              show: true,
              offsetY: 10,
              color: "#667085",
              fontSize: "16px",
            },
            total: {
              show: true,
              label: "Total Vendues",
              color: "#000000",
              fontSize: "16px",
              fontWeight: "bold",
              formatter: function () {
                return totalSoldProperties.toString();
              }
            },
          },
        },
      },
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "darken",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function(value) {
          return `${value} propriétés (${(value/totalSoldProperties*100).toFixed(1)}%)`;
        }
      }
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 280,
            height: 280,
          },
        },
      },
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 240,
            height: 240,
          },
        },
      },
    ],
  }), [chartColors, chartLabels, totalSoldProperties]);

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Ventes par type de propriété
          </h3>
        </div>
        <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Aucune donnée de propriété disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Ventes par type de propriété
        </h3>
        <div className="relative h-fit">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Voir plus
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Exporter les données
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
      
      {salesData.length > 0 ? (
        <div className="flex flex-col items-center gap-8 xl:flex-row">
          <div id="chartDarkStyle">
            <ReactApexChart
              options={options}
              series={chartSeries}
              type="donut"
              height={280}
            />
          </div>
          <div className="flex flex-col items-start gap-6 sm:flex-row xl:flex-col">
            {salesData.map((item) => (
              <div key={item.type} className="flex items-start gap-2.5">
                <div 
                  className="mt-1.5 h-2 w-2 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <div>
                  <h5 className="mb-1 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {item.displayName}
                  </h5>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-700 text-theme-sm dark:text-gray-400">
                      {item.percentage}%
                    </p>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                      {item.count} Properties
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Aucune propriété vendue trouvée</p>
        </div>
      )}
    </div>
  );
}
