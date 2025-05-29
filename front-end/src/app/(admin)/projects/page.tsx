"use client";
import AddProjectModal from "@/components/example/ModalExample/AddProjectModal";
import ProjectsDataTable from "@/components/tables/DataTables/Projects/ProjectsDataTable";
import React, {useState, useEffect, useCallback} from "react";
import getProjects from "@/components/tables/DataTables/Projects/getProperties";
import { FallingLines } from "react-loader-spinner";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const fetchProjects = useCallback(async () => {
      setIsLoading(true);
      // API call to fetch projects
      const data = await getProjects();
      setProjects(data);
      setIsLoading(false);
    }, []);

    useEffect(() => {
      fetchProjects();
    }, [fetchProjects]);
    
    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2
                    className="text-xl font-semibold text-gray-800 dark:text-white/90"
                    x-text="pageName"
                >
                    Projects
                </h2>
                <AddProjectModal onProjectAdded={fetchProjects}/>
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
                <ProjectsDataTable projects={projects} onRefresh={fetchProjects}/>
            )}
        </>
    )
}