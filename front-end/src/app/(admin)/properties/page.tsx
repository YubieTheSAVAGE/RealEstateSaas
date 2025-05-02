import React from "react"
import PropertiesDataTable from "@/components/tables/DataTables/Properties/PropertiesDataTable"
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Immo360 | Properties",
  description: "This is Immo360 Properties Page",
};

export default function Properties() {
    return (
        <>
            <PageBreadcrumb pageTitle="Properties" />
            <div className="col-span-12">
                <PropertiesDataTable />
            </div>
        </>
    )
}