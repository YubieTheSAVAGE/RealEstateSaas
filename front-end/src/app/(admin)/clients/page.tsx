"use client";
import React, {useState, useEffect, useCallback} from "react";
import ClientsDataTable from "@/components/tables/DataTables/Clients/ClientsDataTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import AddClientModal from "@/components/example/ModalExample/AddClientModal";
import getClient from "@/components/tables/DataTables/Clients/getClient";

export default function Clients() {
    const [clients, setClients] = useState([]);

    const fetchClients = useCallback(async () => {
        // API call to fetch clients
        const data = await getClient();
        setClients(data);
    }, []);
    
    useEffect(() => {
        fetchClients();
    }, [fetchClients]);
    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2
                    className="text-xl font-semibold text-gray-800 dark:text-white/90"
                    x-text="pageName"
                >
                    Clients
                </h2>
                <AddClientModal onClientAdded={fetchClients} />
            </div>
            <div className="col-span-12">
                <ClientsDataTable clients={clients} onClientAdded={fetchClients} />
            </div>
        </>
    );
}