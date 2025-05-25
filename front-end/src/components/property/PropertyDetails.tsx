import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PropertyCard from "../cards/horizontal-card/PropertyCard";
import { Property } from "@/types/property";
import getApartmentsById from "@/app/(admin)/properties/getApartmentsById";

interface PropertyDetailsProps {
    propertyId: string;
}

export default function PropertyDetails({ propertyId }: PropertyDetailsProps) {
    const router = useRouter();
    const [property, setProperty] = useState<Property | null>(null);
    
    const fetchData = async () => {
        const result = await getApartmentsById(propertyId);
        console.log("Property data:", result);
        if (!result) {
            console.log("Error fetching property:");
            router.push("/not-found");
        }
        setProperty(result);
    };
    useEffect(() => {
        fetchData();
    });

    return (
        <div>
            <PropertyCard property={property as Property}  onRefresh={fetchData}/>
        </div>
    );
}