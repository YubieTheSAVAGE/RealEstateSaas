import React from "react";
import ClientsDataTable from "@/components/tables/DataTables/Clients/ClientsDataTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import AddClientModal from "@/components/example/ModalExample/AddClientModal";

export const metadata: Metadata = {
  title: "Immo360 | Clients",
  description: "This is Immo360 Clients Page",
};

export default function Clients() {
    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2
                    className="text-xl font-semibold text-gray-800 dark:text-white/90"
                    x-text="pageName"
                >
                    Properties
                </h2>
                <AddClientModal />
            </div>
            <div className="col-span-12">
                <ClientsDataTable />
            </div>
        </>
    );
}