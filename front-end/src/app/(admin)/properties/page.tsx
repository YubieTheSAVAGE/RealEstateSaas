import React from "react"
import PropertiesDataTable from "@/components/tables/DataTables/Properties/PropertiesDataTable"
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import { Metadata } from "next";
import AddApartementsModal from "@/components/example/ModalExample/AddApartementsModal"

export const metadata: Metadata = {
  title: "Immo360 | Properties",
  description: "This is Immo360 Properties Page",
};

export default function Properties() {
    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2
                    className="text-xl font-semibold text-gray-800 dark:text-white/90"
                    x-text="pageName"
                >
                    Properties
                </h2>
                <AddApartementsModal/>
            </div>
            {/* <PageBreadcrumb pageTitle="Properties" /> */}
            <div className="col-span-12">
                <PropertiesDataTable />
            </div>
        </>
    )
}