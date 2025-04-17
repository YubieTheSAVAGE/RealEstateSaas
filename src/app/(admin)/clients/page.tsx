import React from "react";
import ClientsDataTable from "@/components/tables/DataTables/Clients/ClientsDataTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Immo360 | Clients",
  description: "This is Immo360 Clients Page",
};

export default function Clients() {
    return (
        <>
            <PageBreadcrumb pageTitle="Clients" />
            <div className="col-span-12">
                <ClientsDataTable />
            </div>
        </>
    );
}