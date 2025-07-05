"use client";
import React, {useState, useEffect, useCallback} from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import RecentActivity from "@/components/ecommerce/RecentActivity";
import { StatsCard } from "@/components/ecommerce/StatsCard";
import PerformingAgents from "@/components/ecommerce/TopPerformingAgents";
import getApartements from "@/components/tables/DataTables/Properties/getApartements";
import {getUserRoleFromToken, getUserIdFromToken} from "@/app/(auth)/signin/login";
import { FallingLines } from "react-loader-spinner";

export default function HomePageContent() {
    const [apartementsData, setApartementsData] = useState([]);
    const [userRole, setUserRole] = useState("");
    const [isLoading, setIsLoading] = useState(true); 
    
    const fetchApartements = useCallback(async () => {
        setIsLoading(true);
        // API call to fetch projects
        const role = await getUserRoleFromToken();
        setUserRole(role as string);
        if (role == "ADMIN") {
            const data = await getApartements();
            setApartementsData(data);
        }else {
            const data = await getApartements();
            console.log("Fetched Data:", data);
            const userId = await getUserIdFromToken();
            const filteredData = data.filter((apartment: { userId: string | number }) => {
              console.log("User ID from token:", apartment.userId, userId);
              return apartment.userId === userId;
            });
            console.log("Filtered Data:", filteredData);
            setApartementsData(filteredData);
        }
        setIsLoading(false);
    }, []);
    
    useEffect(() => {
        fetchApartements();
    }, [fetchApartements]);
  
  return (
    <>
        {isLoading && (
        <div className="flex h-screen w-full items-center justify-center">
          <FallingLines
            height="80"
            width="80"
            color="#4460FF"
            visible={isLoading}
          />
        </div>
      )}
      {!isLoading && (
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <StatsCard apartments={apartementsData} />

          <MonthlySalesChart properties={apartementsData} />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget userRole={userRole} />
        </div>
        {userRole == "ADMIN" && (
          <div className="width-full col-span-full">
            <PerformingAgents />
          </div>
        )}
        <div className="col-span-12">
          <RecentActivity />
        </div>
      </div>
      )}
    </>
  );
} 