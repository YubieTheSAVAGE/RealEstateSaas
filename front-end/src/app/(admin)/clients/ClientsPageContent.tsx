"use client";
import React, {useState, useEffect, useCallback} from "react";
import ClientsDataTable from "@/components/tables/DataTables/Clients/ClientsDataTable";
import AddClientModal from "@/components/example/ModalExample/AddClientModal";
import getClient from "@/components/tables/DataTables/Clients/getClient";
import { FallingLines } from "react-loader-spinner";

export default function ClientsPageContent() {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchClients = useCallback(async () => {
        setIsLoading(true);
        // API call to fetch clients
        const data = await getClient();
        setClients(data);
        setIsLoading(false);
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
                    <ClientsDataTable clients={clients} onClientAdded={fetchClients} />
                </div>
            )}
        </>
    );
} 