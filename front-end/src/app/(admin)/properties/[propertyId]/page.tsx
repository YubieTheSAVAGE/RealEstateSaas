import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb";
import React from "react";
import PropertyDetails from "@/components/property/PropertyDetails";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ propertyId: string }> }): Promise<Metadata> {
  const { propertyId } = await params;
  
  return {
    title: `Propriété ${propertyId} - Immo 360`,
    description: `Détails de la propriété ${propertyId} - Gestion immobilière Immo 360`,
    icons: {
      icon: "./favicon.ico",
      shortcut: "./favicon.ico",
      apple: "./favicon.ico",
    },
  };
}

export default function PropertyPage({ params }: { params: Promise<{ propertyId: string }> }) {
    const { propertyId } = React.use(params);
    const threeLayerItems = [
        { label: "Accueil", href: "/" },
        { label: "Propriétés", href: "/properties" },
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