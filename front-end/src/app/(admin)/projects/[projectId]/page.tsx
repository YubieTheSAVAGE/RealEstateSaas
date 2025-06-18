import ProjectDetails from "@/components/project/ProjectDetails";
import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb";
import React from "react";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = await params;
    const threeLayerItems = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
        { label: projectId },
    ];

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h2
                        className="text-xl font-semibold text-gray-800 dark:text-white/90"
                        x-text="pageName"
                    >
                        Détails du projet
                    </h2>
                <Breadcrumb items={threeLayerItems} variant="withIcon" />
            </div>
            <div className="">
                <ProjectDetails projectId={projectId} />
            </div>
        </>
    );
}