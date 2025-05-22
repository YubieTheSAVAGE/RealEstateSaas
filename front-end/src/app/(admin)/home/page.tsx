"use client";
import type { Metadata } from "next";
import React, {useState, useEffect, useCallback} from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import RecentActivity from "@/components/ecommerce/RecentActivity";
import { StatsCard } from "@/components/ecommerce/StatsCard";
import PerformingAgents from "@/components/ecommerce/TopPerformingAgents";
import getApartements from "@/components/tables/DataTables/Properties/getApartements";
import {getUserRoleFromToken} from "@/app/(auth)/signin/login";


export default function Ecommerce() {

    const [apartementsData, setApartementsData] = useState([]);
    const [userRole, setUserRole] = useState("");
    
    const fetchApartements = useCallback(async () => {
        // API call to fetch projects
        const role = await getUserRoleFromToken();
        setUserRole(role as string);
        if (role == "ADMIN") {
            const data = await getApartements();
            setApartementsData(data);
        }else {
            const data = await getApartements();
            const filteredData = data.filter((item:any) => item.userId === role);
            setApartementsData(filteredData);
        }
    }, []);
    
    useEffect(() => {
        fetchApartements();
    }, [fetchApartements]);
  
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <StatsCard apartments={apartementsData} />

        <MonthlySalesChart apartements={apartementsData} />
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
      {userRole == "ADMIN" && (
        <div className="width-full col-span-full">
          <PerformingAgents />
        </div>
      )}
      <div className="col-span-12">
        <RecentActivity />
      </div>
    </div>
  );
}
