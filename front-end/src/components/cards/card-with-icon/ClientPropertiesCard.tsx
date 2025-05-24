import React, { useState } from "react";
import { CardDescription, CardTitle } from "../../ui/card";
import { Property } from "@/types/property";
import { FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ClientPropertiesCard({ ClientProperties }: { ClientProperties: Property[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
    function toggleDropdown() {
      setIsOpen(!isOpen);
    }
  
    function closeDropdown() {
      setIsOpen(false);
    }
  
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="relative">
        {/* <div className="mb-5 flex h-14 max-w-14 items-center justify-center rounded-[10.5px] bg-brand-50 text-brand-500 dark:bg-brand-500/10">
          <CgProfile size={28} />
        </div> */}
        <CardTitle>
          Properties
        </CardTitle>
        {/* <div className="absolute right-0 top-0 h-fit">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <ClientNoteModal clientNote={clientNote} />
            </Dropdown>
          </div> */}
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
