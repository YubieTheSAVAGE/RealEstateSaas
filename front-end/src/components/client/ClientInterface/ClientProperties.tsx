"use client"
import React, { useState, useMemo } from "react";
import { Client } from "@/types/client";
import { Property } from "@/types/property";
import ProgressBar from "@/components/progress-bar/ProgressBar";
import { FaRegCheckSquare, FaHome, FaLayerGroup, FaSearch, FaFilter, FaSort, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdApartment, MdVilla, MdStore, MdLandscape, MdHome } from "react-icons/md";
import { dummyClient } from "./dummyClient";
import PropertyDetailsModal from "@/components/client/ClientInterface/PropertyDetailsModal";

interface ClientPropertiesProps {
  client?: Client;
}

const getTypeLabel = (type: string) =>
  type === "DUPLEX"
    ? "Duplex"
    : type === "APARTMENT"
    ? "Appartement"
    : type === "VILLA"
    ? "Villa"
    : type === "STORE"
    ? "Magasin"
    : type === "LAND"
    ? "Terrain"
    : type.charAt(0) + type.slice(1).toLowerCase();

const getTypeIcon = (type: string) => {
  switch (type) {
    case "APARTMENT":
      return <MdApartment className="text-blue-400" />;
    case "VILLA":
      return <MdVilla className="text-green-400" />;
    case "DUPLEX":
      return <MdHome className="text-purple-400" />;
    case "STORE":
      return <MdStore className="text-orange-400" />;
    case "LAND":
      return <MdLandscape className="text-brown-400" />;
    default:
      return <MdApartment className="text-blue-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "SOLD":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700";
    case "RESERVED":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "SOLD":
      return "Acheté";
    case "RESERVED":
      return "Réservé";
    default:
      return status;
  }
};

interface GroupedProperties {
  projectId: number;
  projectName: string;
  projectAddress: string;
  projectProgress: number;
  properties: Property[];
  totalValue: number;
  propertyCount: number;
}

const ClientProperties: React.FC<ClientPropertiesProps> = ({ client }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("project");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());

  // Use dummyClient for demo if no client is passed
  const currentClient = client || dummyClient;

  // Get owned properties only
  const properties = currentClient.apartments || [];

  // Group properties by project
  const groupedProperties = useMemo(() => {
    // Filter by search term
    let filtered = properties.filter(property =>
      property.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.project.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(property => property.type === filterType);
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(property => property.status === filterStatus);
    }

    // Group by project
    const grouped = filtered.reduce((acc, property) => {
      const projectId = property.project.id;
      if (!acc[projectId]) {
        acc[projectId] = {
          projectId,
          projectName: property.project.name,
          projectAddress: property.project.address || "Adresse inconnue",
          projectProgress: property.project.progress || 0,
          properties: [],
          totalValue: 0,
          propertyCount: 0
        };
      }
      
      acc[projectId].properties.push(property);
      acc[projectId].totalValue += property.prixTotal;
      acc[projectId].propertyCount++;
      
      return acc;
    }, {} as Record<number, GroupedProperties>);

    // Convert to array and sort
    const groupedArray = Object.values(grouped);
    groupedArray.sort((a, b) => {
      switch (sortBy) {
        case "project":
          return a.projectName.localeCompare(b.projectName);
        case "progress":
          return b.projectProgress - a.projectProgress;
        case "value":
          return b.totalValue - a.totalValue;
        case "properties":
          return b.propertyCount - a.propertyCount;
        default:
          return a.projectName.localeCompare(b.projectName);
      }
    });

    return groupedArray;
  }, [properties, searchTerm, filterType, filterStatus, sortBy]);

  const propertyTypes = ["APARTMENT", "VILLA", "DUPLEX", "STORE", "LAND"];
  const statusTypes = ["RESERVED", "SOLD"];

  const toggleProjectExpansion = (projectId: number) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const totalValue = groupedProperties.reduce((sum, group) => sum + group.totalValue, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Détails des lots</h3>
        
        {/* Summary Stats */}
        <div className="flex gap-4 text-sm">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
            {properties.length} Propriétés
          </span>
          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full">
            {totalValue.toLocaleString('fr-FR')} DH
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher par projet, numéro ou adresse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
        >
          <FaFilter />
          Filtres {showFilters ? "▼" : "▶"}
        </button>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
              >
                <option value="all">Tous les types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{getTypeLabel(type)}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Statut</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
              >
                <option value="all">Tous les statuts</option>
                {statusTypes.map(status => (
                  <option key={status} value={status}>{getStatusLabel(status)}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trier par</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
              >
                <option value="project">Projet</option>
                <option value="progress">Travaux</option>
                <option value="value">Valeur totale</option>
                <option value="properties">Nombre de propriétés</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Properties List */}
      {groupedProperties.length === 0 ? (
        <div className="text-gray-400 dark:text-gray-500 text-center py-12">
          {searchTerm || filterType !== "all" || filterStatus !== "all" 
            ? "Aucune propriété ne correspond aux critères de recherche."
            : "Aucune propriété trouvée."}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {groupedProperties.map((group) => (
            <div key={group.projectId} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              {/* Project Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => toggleProjectExpansion(group.projectId)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FaHome className="text-blue-500" size={24} />
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">{group.projectName}</h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">({group.propertyCount} propriété{group.propertyCount > 1 ? 's' : ''})</span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm mb-3">{group.projectAddress}</div>
                    
                    {/* Project Summary */}
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-32">
                          <ProgressBar
                            progress={group.projectProgress}
                            size="sm"
                            label="none"
                          />
                        </div>
                        <span className="text-gray-600 dark:text-gray-300">Travaux: {group.projectProgress}%</span>
                      </div>
                      
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {group.totalValue.toLocaleString('fr-FR')} DH
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                    {expandedProjects.has(group.projectId) ? (
                      <FaChevronUp size={20} />
                    ) : (
                      <FaChevronDown size={20} />
                    )}
                  </div>
                </div>
              </div>

              {/* Properties List (Collapsible) */}
              {expandedProjects.has(group.projectId) && (
                <div className="border-t border-gray-100 dark:border-gray-700">
                  <div className="p-6 space-y-4">
                    {group.properties.map((property) => (
                      <div
                        key={property.id}
                        className="flex flex-col lg:flex-row justify-between items-start gap-4 p-4 rounded-xl transition-all duration-200 border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                      >
                        {/* Property Info */}
                        <div className="flex-1 w-full">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {property.number}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(property.status)}`}>
                              {getStatusLabel(property.status)}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-300 text-sm">
                            <span className="flex items-center gap-1">
                              <FaRegCheckSquare className="text-blue-400" />
                              {/* {property.habitable ? `${property.habitable} m²` : "- m²"} */}
                              {property.type === "APARTMENT" || property.type === "DUPLEX" || property.type === "VILLA" ? `${property.habitable} m²` : property.type === "STORE" || property.type === "LAND" ? `${property.totalArea} m²` : "- m²"}
                            </span>
                            <span className="flex items-center gap-1">
                              {getTypeIcon(property.type)}
                              {getTypeLabel(property.type)}
                            </span>
                            {property.type === "APARTMENT" && (
                            <span className="flex items-center gap-1">
                              <FaLayerGroup className="text-blue-400" />
                              Étage {property.floor ?? "-"}
                            </span>
                            )}
                            <span className="flex items-center gap-1 font-semibold text-green-600 dark:text-green-400">
                              {property.prixTotal.toLocaleString('fr-FR')} DH
                            </span>
                          </div>

                          {/* Additional property details */}
                          {(property.balcon || property.terrasse || property.piscine || property.mezzanineArea || property.parkingDisponible) && (
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {property.balcon !== undefined && property.balcon > 0 && (
                                <span>Balcon: {property.balcon} m²</span>
                              )}
                              {property.terrasse !== undefined && property.terrasse > 0 && (
                                <span>Terrasse: {property.terrasse} m²</span>
                              )}
                              {property.piscine !== undefined && property.piscine > 0 && (
                                <span>Piscine: {property.piscine} m²</span>
                              )}
                              {property.mezzanineArea !== undefined && property.mezzanineArea > 0 && (
                                <span>Mezzanine: {property.mezzanineArea} m²</span>
                              )}
                              {property.parkingDisponible && (
                                <span>Parking disponible</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <PropertyDetailsModal property={property} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientProperties;
