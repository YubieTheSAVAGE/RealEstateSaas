"use client";
import React, {useCallback, useState, useEffect} from "react"
import PropertiesDataTable from "@/components/tables/DataTables/Properties/PropertiesDataTable"
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import { Metadata } from "next";
import AddApartementsModal from "@/components/example/ModalExample/AddApartementsModal"
import getApartements from "@/components/tables/DataTables/Properties/getApartements";

export default function Properties() {
    const [apartementsData, setApartementsData] = useState([]);
    
    const fetchApartements = useCallback(async () => {
        // API call to fetch projects
        const data = await getApartements();
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
                <AddApartementsModal onApartementsAdded={fetchApartements}/>
            </div>
            {/* <PageBreadcrumb pageTitle="Properties" /> */}
            <div className="col-span-12">
                <PropertiesDataTable apartmentsData={apartementsData} />
            </div>
        </>
    )
}