"use client";
import React from "react";
import { useRouter } from "next/navigation";
import getProjectById from "./getProjectById";
import ProjectCard from "../cards/horizontal-card/ProjectCard";
import PropertiesTable from "../ecommerce/PropertiesTable";
import { Project } from "@/types/project";

interface ProjectDetailsProps {
    projectId: string;
}

export default function ProjectDetails({ projectId }: ProjectDetailsProps) {
    const router = useRouter();
    const [project, setProject] = React.useState<Project | null>(null);

    const fetchProject = React.useCallback(async () => {
        const data = await getProjectById(projectId);
        console.log("Project data:", data);
        if (data.error || !data) {
            console.log("Error fetching project:", data.error);
            router.push("/not-found");
        }
        setProject(data);
    }, [projectId, router]);

    React.useEffect(() => {
        fetchProject();
    }, [fetchProject]);

    if (!project) {
        return <div>Loading...</div>;
    }    return (
        <div>
            <ProjectCard ProjectDetails={project} onRefresh={fetchProject}  />
            <PropertiesTable ProjectDetails={project.apartments || []} />
        </div>
    );
}
