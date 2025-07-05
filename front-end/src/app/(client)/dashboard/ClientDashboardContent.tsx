"use client";

import React, { useState, useEffect } from "react";
import { BiBuildings, BiCreditCard, BiFile } from "@/components/ui/icons/OptimizedIcons";
import { TbContract } from "@/components/ui/icons/OptimizedIcons";

interface DashboardStats {
  totalProperties: number;
  activeContracts: number;
  pendingPayments: number;
  completedPayments: number;
}

interface Property {
  id: number;
  number: string;
  type: string;
  area: number;
  price: number;
  status: string;
  project: {
    name: string;
  };
}

export default function ClientDashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeContracts: 0,
    pendingPayments: 0,
    completedPayments: 0,
  });
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real data from API
    // For now, using mock data
    setTimeout(() => {
      setStats({
        totalProperties: 3,
        activeContracts: 2,
        pendingPayments: 1,
        completedPayments: 5,
      });
      
      setRecentProperties([
        {
          id: 1,
          number: "A101",
          type: "APARTMENT",
          area: 85,
          price: 250000,
          status: "RESERVED",
          project: { name: "Résidence Les Jardins" }
        },
        {
          id: 2,
          number: "B205",
          type: "APARTMENT",
          area: 120,
          price: 350000,
          status: "SOLD",
          project: { name: "Villa Marina" }
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color 
  }: { 
    title: string; 
    value: number; 
    icon: React.ReactNode; 
    color: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      AVAILABLE: { label: "Disponible", color: "bg-green-100 text-green-800" },
      RESERVED: { label: "Réservé", color: "bg-yellow-100 text-yellow-800" },
      SOLD: { label: "Vendu", color: "bg-blue-100 text-blue-800" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { label: status, color: "bg-gray-100 text-gray-800" };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tableau de bord
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenue dans votre espace client
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Mes Propriétés"
          value={stats.totalProperties}
          icon={<BiBuildings className="w-6 h-6 text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="Contrats Actifs"
          value={stats.activeContracts}
          icon={<TbContract className="w-6 h-6 text-green-600" />}
          color="bg-green-50"
        />
        <StatCard
          title="Paiements en Attente"
          value={stats.pendingPayments}
          icon={<BiCreditCard className="w-6 h-6 text-yellow-600" />}
          color="bg-yellow-50"
        />
        <StatCard
          title="Paiements Effectués"
          value={stats.completedPayments}
          icon={<BiFile className="w-6 h-6 text-purple-600" />}
          color="bg-purple-50"
        />
      </div>

      {/* Recent Properties */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mes Propriétés Récentes
          </h2>
        </div>
        <div className="p-6">
          {recentProperties.length > 0 ? (
            <div className="space-y-4">
              {recentProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <BiBuildings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {property.project.name} - {property.number}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {property.type} • {property.area}m² • {property.price.toLocaleString()}€
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(property.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BiBuildings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Aucune propriété trouvée
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <BiBuildings className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-white">Voir mes propriétés</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Consulter toutes mes propriétés</p>
          </button>
          <button className="p-4 text-left bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <TbContract className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-white">Mes contrats</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Gérer mes contrats</p>
          </button>
          <button className="p-4 text-left bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
            <BiCreditCard className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-white">Mes paiements</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Suivre mes paiements</p>
          </button>
        </div>
      </div>
    </div>
  );
}
