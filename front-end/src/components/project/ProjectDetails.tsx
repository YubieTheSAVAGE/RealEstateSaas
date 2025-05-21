"use client";
import React from "react";
import { notFound, useRouter } from "next/navigation";
import getProjectById from "./getProjectById";
import ProjectCard from "../cards/horizontal-card/ProjectCard";
import PropertiesTable from "../ecommerce/PropertiesTable";
import NotFound from "@/app/not-found";

interface ProjectDetailsProps {
    projectId: string;
}
type project = {
    projectId: string;
    name: string;
    numberOfApartments: number;
    totalSurface: number;
    address: string;
    image: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
    apartments: {
        id: number;
        number: number;
        floor: number;
        type: string;
        area: number;
        price: number;
        pricePerM2?: number;
        zone?: string;
        status: "AVAILABLE" | "RESERVED" | "SOLD";
        updatedAt: string;
    }[];
};


export default function ProjectDetails({ projectId }: ProjectDetailsProps) {
    const router = useRouter();
    const [project, setProject] = React.useState<project | null>(null);

    React.useEffect(() => {
        const fetchProject = async () => {
            const data = await getProjectById(projectId);
            console.log("Project data:", data);
            if (data.error || !data) {
                console.log("Error fetching project:", data.error);
                router.push("/not-found");
            }
            setProject(data);
        };

        fetchProject();
    }, [projectId, router]);

    if (!project) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <ProjectCard ProjectDetails={project} />
            <PropertiesTable />
        </div>
    );
}
