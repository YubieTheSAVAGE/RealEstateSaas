"use client";
import React, { useMemo } from "react"
import dynamic from 'next/dynamic';
import { useOptimizedData } from "@/hooks/useOptimizedData";
import getApartements from "@/components/tables/DataTables/Properties/getApartements";
import { getUserRoleFromToken } from "@/app/(auth)/signin/login";
import { FallingLines } from "react-loader-spinner";

// Lazy load heavy components
const PropertiesDataTable = dynamic(() => import("@/components/tables/DataTables/Properties/PropertiesDataTable"), {
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
    ssr: false
});

const AddPropertyModal = dynamic(() => import("@/components/example/ModalExample/AddApartementsModal"), {
    loading: () => <div className="w-32 h-10 bg-blue-100 animate-pulse rounded" />,
    ssr: false
});

export default function PropertiesPageContent() {
    // Optimized data fetching with caching
    const { data: apartementsData, isLoading, refetch } = useOptimizedData(
        'apartments',
        getApartements,
        { staleTime: 2 * 60 * 1000 } // 2 minutes cache
    );

    const { data: userRole } = useOptimizedData(
        'userRole',
        getUserRoleFromToken,
        { staleTime: 10 * 60 * 1000 } // 10 minutes cache
    );

    // Memoize the refresh function to prevent unnecessary re-renders
    const handleRefresh = useMemo(() => refetch, [refetch]);
    
    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2
                    className="text-xl font-semibold text-gray-800 dark:text-white/90"
                    x-text="pageName"
                >
                    Propriétés
                </h2>
                {userRole === "ADMIN" && (
                    <AddPropertyModal onApartementsAdded={handleRefresh}/>
                )}
            </div>
            {isLoading ? (
                <div className="flex mt-24 w-full items-center justify-center py-4">
                    <FallingLines
                        height="80"
                        width="80"
                        color="#4460FF"
                        visible={isLoading}
                    />
                </div>
            ) : (
                <div className="col-span-12">
                    <PropertiesDataTable apartmentsData={apartementsData || []} onRefresh={handleRefresh}/>
                </div>
            )}
        </>
    )
} 