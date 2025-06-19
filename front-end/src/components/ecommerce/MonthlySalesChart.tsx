"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState, useEffect, useMemo } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "@/icons";
import { Property } from "@/types/property";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});


export default function MonthlySalesChart({ apartements }: { apartements: Property[] }) {
  const [monthlySalesCount, setMonthlySalesCount] = useState<number[]>(Array(12).fill(0));
  const [monthlySalesValue, setMonthlySalesValue] = useState<number[]>(Array(12).fill(0));
  const [selectedView, setSelectedView] = useState<'count' | 'value'>('count');
  const [isOpen, setIsOpen] = useState(false);
  
  // Process apartment data when it changes
  useEffect(() => {
    if (!apartements || !Array.isArray(apartements) || apartements.length === 0) return;
    
    // Initialize arrays for each month
    const salesCountByMonth = Array(12).fill(0);
    const salesValueByMonth = Array(12).fill(0);
    
    // Get current year
    const currentYear = new Date().getFullYear();
    
    // Filter apartments with SOLD status and group by month (for current year only)
    apartements.forEach(apartment => {
      if (apartment.status === "SOLD" && apartment.updatedAt) {
        const updatedDate = new Date(apartment.updatedAt);
        
        // Only include sales from current year
        if (updatedDate.getFullYear() === currentYear) {
          const month = updatedDate.getMonth(); // 0 for January, 11 for December
          
          // Increment count for the month
          salesCountByMonth[month]++;
          
          // Add price to the total value for the month
          salesValueByMonth[month] += apartment.price || 0;
        }
      }
    });
    
    setMonthlySalesCount(salesCountByMonth);
    setMonthlySalesValue(salesValueByMonth);
  }, [apartements]);
  
  // Current displayed data based on selected view
  const currentData = useMemo(() => {
    return selectedView === 'count' ? monthlySalesCount : monthlySalesValue;
  }, [selectedView, monthlySalesCount, monthlySalesValue]);

  // Chart options
  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Fev",
        "Mar",
        "Avr",
        "Mai",
        "Jun",
        "Jul",
        "Aoû",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: function(val: number) {
          if (selectedView === 'value') {
            return `${val.toLocaleString("en-US", {
              style: "currency",
              currency: "MAD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`;
          }
          return `${val} properties`;
        }
      },
    },
  };
  // Chart series data
  const series = [
    {
      name: selectedView === 'count' ? "Propriétés vendues" : "Valeur des ventes",
      data: currentData,
    },
  ];

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function toggleView() {
    setSelectedView(prev => prev === 'count' ? 'value' : 'count');
    closeDropdown();
  }

  // Function to calculate total sales for the year
  const calculateTotalSales = () => {
    if (selectedView === 'count') {
      return monthlySalesCount.reduce((sum, count) => sum + count, 0);
    } else {
      return monthlySalesValue.reduce((sum, value) => sum + value, 0);
    }
  };

  // Get current year
  const currentYear = new Date().getFullYear();

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {selectedView === 'count' ? 'Ventes mensuelles (unités)' : 'Monthly Sales (Value)'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedView === 'count' 
              ? `${calculateTotalSales()} propriétés vendues à ${currentYear}` 
              : `Total value: ${calculateTotalSales().toLocaleString("en-US", {
                  style: "currency",
                  currency: "MAD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}`
            }
          </p>
        </div>
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
              onItemClick={toggleView}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              {selectedView === 'count' ? 'Afficher la valeur (MAD)' : 'Afficher le nombre'}
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

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          {apartements && apartements.length > 0 ? (
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={180}
            />
          ) : (
            <div className="flex justify-center items-center h-44">
              <p className="text-gray-500">Aucune donnée de vente disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
