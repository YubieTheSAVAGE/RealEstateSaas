import React from "react";
import { CardTitle } from "../../ui/card";
import { Client } from "@/types/client";
import Badge from "@/components/ui/badge/Badge";
import { FaIdCard, FaFileAlt, FaCheckCircle, FaExclamationTriangle, FaClock, FaShieldAlt } from "react-icons/fa";

interface ClientStatusCardProps {
  client: Client;
}

export default function ClientStatusCard({ client }: ClientStatusCardProps) {
  // Check identity document completion
  const hasIdentityDocs = client.status === 'CLIENT' && client.identityType && client.identityNumber;
  const identityComplete = hasIdentityDocs && client.identityRecto && (client.identityType === 'Passport' || client.identityVerso);
  
  // Check if client has properties
  const hasProperties = client.apartments && client.apartments.length > 0;
  
  // Check if client has payments
  const hasPayments = client.payments && client.payments.length > 0;
  
  // Calculate completion percentage
  const completionSteps = [
    { name: 'Status Client', completed: client.status === 'CLIENT' },
    { name: 'Documents d\'identité', completed: identityComplete },
    { name: 'Propriétés achetées', completed: hasProperties },
    { name: 'Paiements enregistrés', completed: hasPayments }
  ];
  
  const completedSteps = completionSteps.filter(step => step.completed).length;
  const completionPercentage = (completedSteps / completionSteps.length) * 100;

  const getStatusIcon = (completed: boolean) => {
    return completed ? 
      <FaCheckCircle className="w-4 h-4 text-green-500" /> : 
      <FaClock className="w-4 h-4 text-gray-400" />;
  };

  const getStatusColor = (completed: boolean) => {
    return completed ? "success" : "warning";
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 dark:from-purple-500/20 dark:to-purple-600/20 dark:text-purple-400">
          <FaShieldAlt size={24} />
        </div>
        <div>
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
            Statut Client
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {completionPercentage.toFixed(0)}% complété
          </p>
        </div>
      </div>

      {/* Completion Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progression
          </span>
          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
            {completedSteps}/{completionSteps.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div 
            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Status Steps */}
      <div className="space-y-4 mb-6">
        {completionSteps.map((step, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(step.completed as boolean)}
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {step.name}
              </span>
            </div>
            <Badge 
              size="sm" 
              color={getStatusColor(step.completed as boolean)} 
              variant="light"
            >
              {step.completed ? "Complet" : "En attente"}
            </Badge>
          </div>
        ))}
      </div>

      {/* Identity Documents Section */}
      {client.status === 'CLIENT' && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center space-x-2 mb-3">
            <FaIdCard className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Documents d'identité
            </span>
          </div>
          
          {hasIdentityDocs ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Type: {client.identityType}
                </span>
                <Badge size="sm" color="info" variant="light">
                  {client.identityNumber}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className={`p-2 rounded-lg text-center ${client.identityRecto ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <div className="flex items-center justify-center space-x-1">
                    {client.identityRecto ? 
                      <FaCheckCircle className="w-3 h-3 text-green-500" /> : 
                      <FaExclamationTriangle className="w-3 h-3 text-gray-400" />
                    }
                    <span className="text-xs text-gray-600 dark:text-gray-300">Recto</span>
                  </div>
                </div>
                
                {client.identityType === 'Carte d\'identité' && (
                  <div className={`p-2 rounded-lg text-center ${client.identityVerso ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                    <div className="flex items-center justify-center space-x-1">
                      {client.identityVerso ? 
                        <FaCheckCircle className="w-3 h-3 text-green-500" /> : 
                        <FaExclamationTriangle className="w-3 h-3 text-gray-400" />
                      }
                      <span className="text-xs text-gray-600 dark:text-gray-300">Verso</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <FaExclamationTriangle className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Documents d'identité requis
              </p>
            </div>
          )}
        </div>
      )}

      {/* Client Type Summary */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Type de client
          </span>
          <Badge 
            size="md" 
            color={client.status === "CLIENT" ? "success" : "info"} 
            variant="light"
          >
            {client.status === "CLIENT" ? "Client" : "Lead"}
          </Badge>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {client.status === "CLIENT" ? 
            "Client avec accès complet aux services" : 
            "Lead en cours de conversion"
          }
        </div>
      </div>
    </div>
  );
} 