"use client";
import React, {useCallback, useState, useEffect} from "react"
import PropertiesDataTable from "@/components/tables/DataTables/Properties/PropertiesDataTable"
import getApartements from "@/components/tables/DataTables/Properties/getApartements";
import AddPropertyModal from "@/components/example/ModalExample/AddApartementsModal";
import { FallingLines } from "react-loader-spinner";

export default function Properties() {
    const [apartementsData, setApartementsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const fetchApartements = useCallback(async () => {
        setIsLoading(true);
        // API call to fetch projects
        const data = await getApartements();
        console.log("data", data);
        setApartementsData(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchApartements();
    }, [fetchApartements]);
    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2
                    className="text-xl font-semibold text-gray-800 dark:text-white/90"
                    x-text="pageName"
                >
                    Properties
                </h2>
                <AddPropertyModal onApartementsAdded={fetchApartements}/>
            </div>
            {/* <PageBreadcrumb pageTitle="Properties" /> */}
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
                    <PropertiesDataTable apartmentsData={apartementsData} onRefresh={fetchApartements}/>
                </div>
            )}
        </>
    )
}