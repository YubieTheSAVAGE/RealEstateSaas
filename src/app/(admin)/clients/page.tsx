import React from "react";
import ClientsDataTable from "@/components/tables/DataTables/Clients/ClientsDataTable";

export default function Clients() {
    return (
        <>
            <div className="col-span-12">
                <ClientsDataTable />
            </div>
        </>
    );
}