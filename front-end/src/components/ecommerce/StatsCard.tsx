"use client";
import React, { useMemo } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, GroupIcon, DollarLineIcon } from "@/icons";
import { Property } from "@/types/property";


export const StatsCard = ({apartments}: {apartments: Property[]}) => {
  // Calculate statistics from apartment data
  const stats = useMemo(() => {
    // Ensure apartments is an array before processing
    const apartmentsArray = Array.isArray(apartments) ? apartments : [];
    
    if (!apartmentsArray || apartmentsArray.length === 0) {
      return {
        soldCount: 0,
        totalSales: 0,
        projectsCount: 0,
        soldPercentChange: 0,
        isPositiveChange: true
      };
    }

    // Count sold properties
    const soldProperties = apartmentsArray.filter(apt => apt.status === "SOLD");
    const soldCount = soldProperties.length;
    
    // Calculate total sales amount
    const totalSales = soldProperties.reduce((total, apt) => total + (apt.price || 0), 0);
    
    // Get unique projects count
    const uniqueProjects = new Set(apartmentsArray.map(apt => apt.project.id));
    const projectsCount = uniqueProjects.size;
    
    // Calculate percentage change (comparing to previous period)
    // For demo purposes, let's assume a random percentage between -15 and +20
    // Calculate percentage change based on time periods
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Get sold properties in current period (last 30 days)
    const soldCurrentPeriod = soldProperties.filter(apt => 
      new Date(apt.updatedAt || "") >= thirtyDaysAgo
    ).length;

    // Get sold properties in previous period (30-60 days ago)
    const soldPreviousPeriod = soldProperties.filter(apt => 
      new Date(apt.updatedAt || "") >= sixtyDaysAgo && new Date(apt.updatedAt || "") < thirtyDaysAgo
    ).length;

    // Calculate percentage change
    const soldPercentChange = soldPreviousPeriod === 0 
      ? (soldCurrentPeriod > 0 ? 100 : 0) 
      : +(((soldCurrentPeriod - soldPreviousPeriod) / soldPreviousPeriod) * 100).toFixed(2);
    const isPositiveChange = soldPercentChange >= 0;
    
    return {
      soldCount,
      totalSales,
      projectsCount,
      soldPercentChange: Math.abs(soldPercentChange),
      isPositiveChange
    };
  }, [apartments]);
  
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Sold Properties Metric --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Nombre total de biens vendus
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {stats.soldCount}
            </h4>
          </div>
          <Badge color={stats.isPositiveChange ? "success" : "error"}>
            {stats.isPositiveChange ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {stats.soldPercentChange}%
          </Badge>
        </div>
      </div>
      {/* <!-- Sold Properties Metric End --> */}

      {/* <!-- Total Sales Value Metric --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <DollarLineIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Valeur totale des ventes
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {stats.totalSales.toLocaleString("en-US", {
                style: "currency",
                currency: "MAD",
                maximumFractionDigits: 0
              })}
            </h4>
          </div>
          {/* <Badge color={stats.isPositiveChange ? "success" : "error"}>
            {stats.isPositiveChange ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {(stats.soldPercentChange * 0.8).toFixed(2)}%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Total Sales Value Metric End --> */}

      {/* <!-- Total Projects Metric -->
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Nombre total de projets
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {stats.projectsCount}
            </h4>
          </div>
          
          {stats.projectsCount > 0 && (
            <Badge color="info">
              Actif
            </Badge>
          )}
        </div>
      </div> */}
      {/* <!-- Total Projects Metric End --> */}
    </div>
  );
};
