import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddProjectModal from "@/components/example/ModalExample/AddProjectModal";
import ProjectsDataTable from "@/components/tables/DataTables/Projects/ProjectsDataTable";
import React from "react";

export default function Projects() {
    return (
        <>
            {/* <PageBreadcrumb pageTitle="Projects" /> */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2
                    className="text-xl font-semibold text-gray-800 dark:text-white/90"
                    x-text="pageName"
                >
                    Projects
                </h2>
                <AddProjectModal/>
            </div>
            <ProjectsDataTable />
        </>
    )
}