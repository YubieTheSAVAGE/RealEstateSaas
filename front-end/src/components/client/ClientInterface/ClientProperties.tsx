"use client"
import React from "react";
import { Client } from "@/types/client";
import { Property } from "@/types/property";
import PropertyCard from "@/components/cards/horizontal-card/PropertyCard";
import ProgressBar from "@/components/progress-bar/ProgressBar";
import { dummyClient } from "./dummyClient";

interface ClientPropertiesProps {
  client?: Client;
}

const ClientProperties: React.FC<ClientPropertiesProps> = ({ client }) => {
  // Use dummyClient for demo if no client is passed
  const currentClient = client || dummyClient;
  // Combine owned and reserved properties
  const properties: Property[] = [
    ...(currentClient.apartments || []),
    ...(currentClient.interestedApartments || []),
  ];

  return (
    <div className="bg-gray-50 rounded-2xl p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Détails des lots</h3>
      {properties.length === 0 ? (
        <div className="text-gray-400 text-center py-8">Aucune propriété trouvée.</div>
      ) : (
        <div className="flex flex-col gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl shadow flex flex-col md:flex-row items-stretch p-4 md:p-6 gap-4 border border-gray-100 hover:shadow-lg transition-shadow relative"
            >
              {/* Left: Main info */}
              <div className="flex-1 flex flex-col gap-2 justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-500">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M3 10.75V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8.25a2 2 0 0 0-.89-1.66l-7-4.67a2 2 0 0 0-2.22 0l-7 4.67A2 2 0 0 0 3 10.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                    </span>
                    <span className="font-bold text-base md:text-lg text-gray-900">
                      {property.type === "DUPLEX" ? "Duplex" : property.type === "APARTMENT" ? "Appartement" : property.type.charAt(0) + property.type.slice(1).toLowerCase()} T3 – Lot {property.number}
                    </span>
                  </div>
                  <div className="text-gray-500 text-sm mb-2">
                    {property.project?.address || "Adresse inconnue"}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <ProgressBar progress={property.project?.progress || 0} size="md" label="none" className="w-40" />
                  <span className="text-gray-500 text-xs ml-2">
                    Progression : {property.project?.progress ?? 0}%
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-gray-500 text-xs mb-2">
                  <span className="flex items-center gap-1">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="8" cy="8" r="8" fill="#E5E7EB"/><text x="8" y="12" textAnchor="middle" fontSize="8" fill="#6B7280">{property.habitable || "-"}</text></svg>
                    {property.habitable ? `${property.habitable} m²` : "- m²"}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" fill="#E5E7EB"/><text x="12" y="15" textAnchor="middle" fontSize="8" fill="#6B7280">{property.type === "DUPLEX" ? "Duplex" : property.type === "APARTMENT" ? "Appartement" : property.type.charAt(0) + property.type.slice(1).toLowerCase()}</text></svg>
                    {property.type === "DUPLEX" ? "Duplex" : property.type === "APARTMENT" ? "Appartement" : property.type.charAt(0) + property.type.slice(1).toLowerCase()}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" fill="#E5E7EB"/><text x="12" y="15" textAnchor="middle" fontSize="8" fill="#6B7280">{property.floor || "-"}</text></svg>
                    Étage {property.floor ?? "-"}
                  </span>
                </div>
                <button className="ml-auto mt-2 px-4 py-1 rounded-full border border-blue-500 text-blue-600 font-semibold text-xs hover:bg-blue-50 transition">
                  voir tout
                </button>
              </div>
              {/* Right: Card preview (optional, can use PropertyCard for more details) */}
              {/* <div className="hidden md:block w-[320px] max-w-full">
                <PropertyCard property={property} />
              </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientProperties;
