import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb";
import React from "react";

export default function ProjectPage({ params }: { params: { propertyId: string } }) {
    const { propertyId } = params;
    const threeLayerItems = [
        { label: "Home", href: "/" },
        { label: "Properties", href: "/properties" },
        { label: propertyId },
    ];

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h2
                        className="text-xl font-semibold text-gray-800 dark:text-white/90"
                        x-text="pageName"
                    >
                        Property Details
                    </h2>
                <Breadcrumb items={threeLayerItems} variant="withIcon" />
            </div>
            <div className="">
                
            </div>
        </>
    );
}