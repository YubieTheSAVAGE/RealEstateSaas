"use client";
import React, {useCallback, useState, useEffect} from "react"
import PropertiesDataTable from "@/components/tables/DataTables/Properties/PropertiesDataTable"
import getApartements from "@/components/tables/DataTables/Properties/getApartements";
import AddPropertyModal from "@/components/example/ModalExample/AddApartementsModal";

export default function Properties() {
    const [apartementsData, setApartementsData] = useState([]);
    
    const fetchApartements = useCallback(async () => {
        // API call to fetch projects
        const data = await getApartements();
        console.log("data", data);
        setApartementsData(data);
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
            <div className="col-span-12">
                <PropertiesDataTable apartmentsData={apartementsData} onRefresh={fetchApartements}/>
            </div>
        </>
    )
}