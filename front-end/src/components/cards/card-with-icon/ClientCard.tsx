import React, { useState } from "react";
import { CardTitle } from "../../ui/card";
import { CgProfile } from "react-icons/cg";
import { Client } from "@/types/client";
import Badge from "@/components/ui/badge/Badge";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import DeleteModal from "@/components/example/ModalExample/DeleteModal";
import EditClientModal from "@/components/example/ModalExample/EditClientModal";
import { useRouter } from "next/navigation";
import deleteClient from "@/components/tables/DataTables/Clients/deleteClient";
import { FaPhone, FaEnvelope, FaWhatsapp, FaIdCard, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";

export default function ClientCard({ client, onRefresh }: { client: Client, onRefresh?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  
  const router = useRouter();
  const handleDelete = async (id: string) => {
    const success: boolean = await deleteClient(id);
    if (success) {
      router.push("/clients");
    }
  };

  // Calculate total investment
  const totalInvestment = client.apartments?.reduce((sum, property) => sum + (property.price || 0), 0) || 0;
  
  // Check identity document completion
  const hasIdentityDocs = client.status === 'CLIENT' && client.identityType && client.identityNumber;
  const identityComplete = hasIdentityDocs && client.identityRecto && (client.identityType === 'Passport' || client.identityVerso);

  // Contact actions
  const handleCall = () => {
    window.open(`tel:${client.phoneNumber}`, '_self');
  };

  const handleEmail = () => {
    window.open(`mailto:${client.email}`, '_self');
  };

  const handleWhatsApp = () => {
    const whatsappNumber = client.whatsappNumber || client.phoneNumber;
    window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`, '_blank');
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        {/* Header with Icon and Status */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 dark:from-brand-500/20 dark:to-brand-600/20 dark:text-brand-400">
              <CgProfile size={32} />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {client.name}
              </CardTitle>
              <Badge 
                className="text-xs font-medium" 
                size="sm" 
                color={client.status === "CLIENT" ? "success" : "info"} 
                variant="light"
              >
                {client.status === "CLIENT" ? "Client" : "Lead"}
              </Badge>
            </div>
          </div>
          
          {/* Dropdown Menu */}
          <div className="relative">
            <button onClick={toggleDropdown} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-48 p-2"
            >
              <EditClientModal clientData={client} details={true} onClientUpdated={onRefresh} />
              <DeleteModal
                itemId={String(client.id)}
                heading="Supprimer le client"
                description="Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible."
                onDelete={() => handleDelete(String(client.id))}
                details={true}
              />
            </Dropdown>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-gray-400 w-4 h-4" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{client.email}</span>
            </div>
            <button 
              onClick={handleEmail}
              className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 hover:text-blue-700 transition-colors"
              title="Envoyer un email"
            >
              <FaEnvelope className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaPhone className="text-gray-400 w-4 h-4" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{client.phoneNumber}</span>
            </div>
            <button 
              onClick={handleCall}
              className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 hover:text-green-700 transition-colors"
              title="Appeler"
            >
              <FaPhone className="w-4 h-4" />
            </button>
          </div>

          {client.whatsappNumber && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaWhatsapp className="text-gray-400 w-4 h-4" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{client.whatsappNumber}</span>
              </div>
              <button 
                onClick={handleWhatsApp}
                className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 hover:text-green-700 transition-colors"
                title="Contacter sur WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="text-gray-400 w-4 h-4" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Provenance: <span className="font-medium text-gray-900 dark:text-white">{client.provenance}</span>
            </span>
          </div>
          
          {totalInvestment > 0 && (
            <div className="flex items-center space-x-3">
              <FaMoneyBillWave className="text-gray-400 w-4 h-4" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Investissement total: <span className="font-medium text-green-600 dark:text-green-400">
                  {totalInvestment.toLocaleString()} MAD
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Identity Document Status (for CLIENT status) */}
        {client.status === 'CLIENT' && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaIdCard className="text-gray-400 w-4 h-4" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Documents d'identité
                </span>
              </div>
              <Badge 
                size="sm" 
                color={identityComplete ? "success" : "warning"} 
                variant="light"
              >
                {identityComplete ? "Complet" : "Incomplet"}
              </Badge>
            </div>
            {hasIdentityDocs && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {client.identityType} - {client.identityNumber}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
