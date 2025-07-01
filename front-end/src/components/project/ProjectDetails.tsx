"use client";
import React from "react";
import { useRouter } from "next/navigation";
import getProjectById from "./getProjectById";
import ProjectCard from "../cards/horizontal-card/ProjectCard";
import PropertiesTable from "../ecommerce/PropertiesTable";
import { Project } from "@/types/project";
import { FallingLines } from "react-loader-spinner";
import MapView from "@/components/map/ProjectMap";

interface ProjectDetailsProps {
    projectId: string;
}

export default function ProjectDetails({ projectId }: ProjectDetailsProps) {
    const router = useRouter();
    const [project, setProject] = React.useState<Project | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const fetchProject = React.useCallback(async () => {
        setIsLoading(true);
        const data = await getProjectById(projectId);
        console.log("Project data:", data);
        if (data.error || !data) {
            console.log("Error fetching project:", data.error);
            router.push("/not-found");
        }
        setProject(data);
        setIsLoading(false);
    }, [projectId, router]);

    React.useEffect(() => {
        fetchProject();
    }, [fetchProject]);

    if (!project) {
        return <div className="flex h-screen w-full items-center justify-center py-4">
            <FallingLines
                height="80"
                width="80"
                color="#4460FF"
                visible={isLoading}
            />
        </div>;
    }
    return (
        <div>
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:flex-row sm:items-center sm:gap-6">
                <MapView projectName={project.name} projectLocation={{ latitude: project.latitude, longitude: project.longitude }} />
            </div>
            <ProjectCard ProjectDetails={project} onRefresh={fetchProject}  />
            <PropertiesTable ProjectDetails={project.properties || []} />
        </div>
    );
}
