import type { Metadata } from "next";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import RecentActivity from "@/components/ecommerce/RecentActivity";
import { StatsCard } from "@/components/ecommerce/StatsCard";
import PerformingAgents from "@/components/ecommerce/TopPerformingAgents";

export const metadata: Metadata = {
  title:
    "Immo360 | Dashboard",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <StatsCard />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      {/* <div className="col-span-12">
        <StatisticsChart />
      </div> */}

      {/* <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div> */}

      <div className="width-full col-span-full">
        <PerformingAgents />
      </div>
      <div className="col-span-12">
        <RecentActivity />
      </div>
    </div>
  );
}
