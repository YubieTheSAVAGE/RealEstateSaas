import React from "react";
import { CardDescription, CardTitle } from "../../ui/card";
import { Property } from "@/types/property";
import { FaEye, FaHome, FaMoneyBillWave, FaMapMarkerAlt } from "react-icons/fa";
import { MdApartment, MdVilla, MdStore, MdLandscape, MdHome } from "react-icons/md";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/badge/Badge";

export default function ClientPropertiesCard({ ClientProperties }: { ClientProperties: Property[] }) {
  const router = useRouter();
  
  // Calculate total portfolio value
  const totalPortfolioValue = ClientProperties.reduce((sum, property) => sum + (property.price || 0), 0);
  
  // Group properties by type
  const propertyTypeCounts = ClientProperties.reduce((acc, property) => {
    acc[property.type] = (acc[property.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get property type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "APARTMENT":
        return <MdApartment className="w-5 h-5 text-blue-500" />;
      case "VILLA":
        return <MdVilla className="w-5 h-5 text-green-500" />;
      case "DUPLEX":
        return <MdHome className="w-5 h-5 text-purple-500" />;
      case "STORE":
        return <MdStore className="w-5 h-5 text-orange-500" />;
      case "LAND":
        return <MdLandscape className="w-5 h-5 text-brown-500" />;
      default:
        return <MdApartment className="w-5 h-5 text-blue-500" />;
    }
  };

  // Get property type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "APARTMENT": return "Appartement";
      case "VILLA": return "Villa";
      case "DUPLEX": return "Duplex";
      case "STORE": return "Magasin";
      case "LAND": return "Terrain";
      default: return type;
    }
  };

  // Get property status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "SOLD": return "success";
      case "RESERVED": return "warning";
      case "AVAILABLE": return "info";
      default: return "info";
    }
  };

  if (!ClientProperties.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-50 to-green-100 text-green-600 dark:from-green-500/20 dark:to-green-600/20 dark:text-green-400">
            <FaHome size={24} />
          </div>
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
            Propriétés
          </CardTitle>
        </div>
        
        <div className="text-center py-8">
          <FaHome className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Aucune propriété achetée par ce client
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-50 to-green-100 text-green-600 dark:from-green-500/20 dark:to-green-600/20 dark:text-green-400">
          <FaHome size={24} />
        </div>
        <div>
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
            Propriétés
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {ClientProperties.length} propriété{ClientProperties.length > 1 ? 's' : ''} achetée{ClientProperties.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Portfolio Value */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <FaMoneyBillWave className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Valeur totale du portefeuille
          </span>
        </div>
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
          {totalPortfolioValue.toLocaleString()} MAD
        </div>
      </div>

      {/* Property Type Distribution */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Répartition par type
        </h4>
        <div className="space-y-2">
          {Object.entries(propertyTypeCounts).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2">
                {getTypeIcon(type)}
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {getTypeLabel(type)}
                </span>
              </div>
              <Badge size="sm" color="info" variant="light">
                {count}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Properties List */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Détails des propriétés
        </h4>
        {ClientProperties.slice(0, 3).map((property) => (
          <div 
            key={property.id} 
            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            onClick={() => router.push(`/properties/${property.id}`)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getTypeIcon(property.type)}
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {property.project.name}
                </span>
              </div>
              <Badge 
                size="sm" 
                color={getStatusColor(property.status)} 
                variant="light"
              >
                {property.status === "SOLD" ? "Vendu" : 
                 property.status === "RESERVED" ? "Réservé" : "Disponible"}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {getTypeLabel(property.type)} - {property.number}
                </span>
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  {property.price ? `${property.price.toLocaleString()} MAD` : "Prix non disponible"}
                </span>
              </div>
              
              {property.zone && (
                <div className="flex items-center space-x-1">
                  <FaMapMarkerAlt className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {property.zone}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {ClientProperties.length > 3 && (
          <div className="text-center pt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{ClientProperties.length - 3} autre{ClientProperties.length - 3 > 1 ? 's' : ''} propriété{ClientProperties.length - 3 > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* View All Properties Button */}
      <button 
        onClick={() => router.push(`/clients/${ClientProperties[0]?.client?.id || 'unknown'}/properties`)}
        className="w-full mt-4 px-4 py-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium transition-colors duration-200"
      >
        Voir toutes les propriétés
      </button>
    </div>
  );
}
