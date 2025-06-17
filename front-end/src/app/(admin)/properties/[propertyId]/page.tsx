"use client";
import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb";
import React from "react";
import PropertyDetails from "@/components/property/PropertyDetails";

export default function PropertyPage({ params }: { params: Promise<{ propertyId: string }> }) {
    const { propertyId } = React.use(params);
    const threeLayerItems = [
        { label: "Home", href: "/" },
        { label: "Properties", href: "/properties" },
        { label: propertyId },
    ];

    // const [properties, setProperties] = useState<any>(null);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const result = await getApartmentsById(propertyId);
    //         console.log("Property data:", result);
    //         setProperties(result);
    //     };
    //     fetchData();
    // }, [propertyId]);

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h2
                        className="text-xl font-semibold text-gray-800 dark:text-white/90"
                        x-text="pageName"
                    >
                        Détails de la propriété
                    </h2>
                <Breadcrumb items={threeLayerItems} variant="withIcon" />
            </div>
            <div className="">
                <PropertyDetails propertyId={propertyId} />
            </div>
        </>
    );
}