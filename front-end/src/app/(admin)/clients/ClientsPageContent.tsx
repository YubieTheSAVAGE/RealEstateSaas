"use client";
import React, {useState, useEffect, useCallback} from "react";
import ClientsDataTable from "@/components/tables/DataTables/Clients/ClientsDataTable";
import AddClientModal from "@/components/example/ModalExample/AddClientModal";
import getClient from "@/components/tables/DataTables/Clients/getClient";
import { FallingLines } from "react-loader-spinner";
import Button from "@/components/ui/button/Button";

export default function ClientsPageContent() {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchClients = useCallback(async () => {
        setIsLoading(true);
        console.log("🎯 [ClientsPage] Fetching clients data...");
        // API call to fetch clients - this will trigger detailed logging
        const data = await getClient();
        setClients(data);
        setIsLoading(false);
        console.log("✅ [ClientsPage] Clients data loaded, check console for details");
    }, []);

    const showDatabaseContent = () => {
        console.log("🔍 [ClientsPage] Opening database content display...");
        window.open('http://localhost:3001/api/clients/display/all', '_blank');
    };

    const refreshWithLogging = async () => {
        console.log("🔄 [ClientsPage] Manual refresh triggered - detailed logging enabled");
        await fetchClients();
    };

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
                <div className="flex gap-2">
                    <Button
                        onClick={refreshWithLogging}
                        variant="outline"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                        🔄 Refresh & Log
                    </Button>
                    <Button
                        onClick={showDatabaseContent}
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                        🗄️ Show DB Content
                    </Button>
                    <AddClientModal onClientAdded={fetchClients} />
                </div>
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