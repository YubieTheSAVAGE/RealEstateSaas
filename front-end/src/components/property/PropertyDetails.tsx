"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PropertyCard from "../cards/horizontal-card/PropertyCard";
import { Property } from "@/types/property";
import getApartmentsById from "@/app/(admin)/properties/getApartmentsById";
import { FallingLines } from "react-loader-spinner";
import InterestedClientTable from "../ecommerce/InterstedClientTable";
import { dummyProperties } from "../tables/DataTables/Properties/dummyProperties"; // test data

interface PropertyDetailsProps {
    propertyId: string;
}

export default function PropertyDetails({ propertyId }: PropertyDetailsProps) {
    const router = useRouter();
    const [property, setProperty] = useState<Property | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const fetchData = async () => {
        setIsLoading(true);
        const result = await getApartmentsById(propertyId);
        console.log("Property data:", result);
        if (!result) {
            console.log("Error fetching property:");
            router.push("/not-found");
        }
        setProperty(result);
        setIsLoading(false);
    };
    useEffect(() => {
        fetchData();
    }, [propertyId, router]);

    if (!property && isLoading) {
        return (
            <div className="flex mt-24 w-full items-center justify-center py-4">
                <FallingLines
                    height="80"
                    width="80"
                    color="#4460FF"
                    visible={isLoading}
                />
            </div>
        );
    }
    return (
        <div>
            <PropertyCard property={property as Property}  onRefresh={fetchData}/>
            <div className="mt-6">
                {/* <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                    Clients intéressés
                </h3> */}
                <InterestedClientTable ClientDetails={property?.interestedClients || []} />
            </div>
        </div>
    );
}