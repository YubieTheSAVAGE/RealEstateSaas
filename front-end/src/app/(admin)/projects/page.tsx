import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProjectsDataTable from "@/components/tables/DataTables/Projects/ProjectsDataTable";
import React from "react";

export default function Projects() {
    return (
        <>
            <PageBreadcrumb pageTitle="Projects" />
            <ProjectsDataTable />
        </>
    )
}