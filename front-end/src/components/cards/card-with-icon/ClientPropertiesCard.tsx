import React from "react";
import { CardDescription, CardTitle } from "../../ui/card";
import { Property } from "@/types/property";
import { FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ClientPropertiesCard({ ClientProperties }: { ClientProperties: Property[] }) {
  const router = useRouter();
  
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="relative">
        <CardTitle>
          Properties
        </CardTitle>
          {!ClientProperties.length && (
            <div className="text-center mt-16">
              <CardDescription>
                No properties bought by this client
              </CardDescription>
            </div>
          )}
          {ClientProperties.map((property) => (
            <div className="flex items-center justify-between mb-4" key={property.id}>
              <CardDescription key={property.id}>
                {property.project.name} - {property.type} ({property.number}) - {property.price ? <span className="text-success-500">{`${property.price.toLocaleString()} MAD`}</span> : "Price not available"}
              </CardDescription>
              <FaEye 
               className="inline-block ml-2 text-gray-600 hover:text-blue-600 dark:hover:text-gray-300 cursor-pointer" 
                onClick={() => {
                  router.push(`/properties/${property.id}`);
                }}
              />
            </div>
            ))}
        </div>
    </div>
  );
}
