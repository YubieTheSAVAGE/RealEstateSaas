"use client";
import React from "react";
import { useRouter } from "next/navigation";
import getProjectById from "./getProjectById";
import ProjectCard from "../cards/horizontal-card/ProjectCard";
import PropertiesTable from "../ecommerce/PropertiesTable";

interface ProjectDetailsProps {
    projectId: string;
}

export default function ProjectDetails({ projectId }: ProjectDetailsProps) {
    const router = useRouter();
    const [project, setProject] = React.useState<any>(null);

    React.useEffect(() => {
        const fetchProject = async () => {
            const data = await getProjectById(projectId);
            setProject(data);
        };

        fetchProject();
    }, [projectId]);

    if (!project) {
        return <div>Loading...</div>;
    }    return (
        <div>
            <ProjectCard ProjectDetails={project} />
            <PropertiesTable ProjectDetails={project.apartments || project.properties || []} />
        </div>
    );
}
