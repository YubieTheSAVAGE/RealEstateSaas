"use client"
import React, { useState } from "react";
import { Property } from "@/types/property";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { 
  FaHome, 
  FaMapMarkerAlt, 
  FaRulerCombined, 
  FaMoneyBillWave, 
  FaCalendarAlt,
  FaBuilding,
  FaLayerGroup,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaFileAlt,
  FaDownload,
  FaPrint,
  FaShare,
  FaTimes,
  FaExpand,
  FaCompress,
  FaParking
} from "react-icons/fa";
import { 
  MdApartment, 
  MdVilla, 
  MdStore, 
  MdLandscape, 
  MdHome,
  MdAttachMoney,
  MdPool,
  MdBalcony,
} from "react-icons/md";
import { PhotoProvider, PhotoView } from "react-photo-view";
import 'react-photo-view/dist/react-photo-view.css';
import ProgressBar from "@/components/progress-bar/ProgressBar";

interface PropertyDetailsModalProps {
  property: Property;
  clientName?: string;
  trigger?: React.ReactNode;
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
      return <MdApartment className="text-blue-500" size={24} />;
    case "VILLA":
      return <MdVilla className="text-green-500" size={24} />;
    case "DUPLEX":
      return <MdHome className="text-purple-500" size={24} />;
    case "STORE":
      return <MdStore className="text-orange-500" size={24} />;
    case "LAND":
      return <MdLandscape className="text-brown-500" size={24} />;
    default:
      return <MdApartment className="text-blue-500" size={24} />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "SOLD":
      return "bg-green-100 text-green-800 border-green-200";
    case "RESERVED":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({ 
  property, 
  clientName,
  trigger 
}) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'pricing' | 'documents'>('overview');
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: FaHome },
    { id: 'details', label: 'Détails techniques', icon: FaRulerCombined },
    { id: 'pricing', label: 'Prix & Paiements', icon: FaMoneyBillWave },
    { id: 'documents', label: 'Documents', icon: FaFileAlt },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Propriété ${property.number}`,
        text: `Détails de la propriété ${property.number} - ${property.project.name}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers');
    }
  };

  return (
    <>
      {trigger ? (
        <div onClick={openModal}>{trigger}</div>
      ) : (
        <button
            onClick={openModal}
            className="px-4 py-2 rounded-full border border-blue-500 text-blue-600 font-semibold text-sm bg-white hover:bg-blue-50 transition shadow"
            aria-label="Voir détails"
        >
            Détails
        </button>
      )}

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-6xl p-0 m-4 overflow-hidden"
      >
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-4">
              {getTypeIcon(property.type)}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Propriété {property.number}
                </h2>
                <p className="text-gray-600">{property.project.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(property.status)}`}>
                {getStatusLabel(property.status)}
              </span>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors "
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-white">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="p-6 space-y-6">
                {/* Property Image */}
                <div className="relative">
                  <div className={`rounded-xl overflow-hidden bg-gray-100 ${isImageExpanded ? 'fixed inset-4 z-999 bg-black bg-opacity-90' : 'h-80'}`}>
                    {property.image ? (
                      <div className="relative group">
                        <PhotoProvider
                          maskOpacity={0.8}
                          toolbarRender={({ onRotate, rotate, onScale, scale }) => {
                            return (
                              <>
                                <svg
                                  className="PhotoView-Slider__toolbarIcon"
                                  onClick={() => onRotate(rotate + 90)}
                                  width="44"
                                  height="44"
                                  fill="white"
                                  viewBox="0 0 768 768"
                                >
                                  <path d="M565.5 202.5l75-75v225h-225l103.5-103.5c-34.5-34.5-82.5-57-135-57-106.5 0-192 85.5-192 192s85.5 192 192 192c84 0 156-52.5 181.5-127.5h66c-28.5 111-127.5 192-247.5 192-141 0-255-115.5-255-256.5s114-256.5 255-256.5c70.5 0 135 28.5 181.5 75z" />
                                </svg>
                                <svg
                                  className="PhotoView-Slider__toolbarIcon"
                                  width="44"
                                  height="44"
                                  viewBox="0 0 768 768"
                                  fill="white"
                                  onClick={() => onScale(scale + 0.5)}
                                >
                                  <path d="M384 640.5q105 0 180.75-75.75t75.75-180.75-75.75-180.75-180.75-75.75-180.75 75.75-75.75 180.75 75.75 180.75 180.75 75.75zM384 64.5q132 0 225.75 93.75t93.75 225.75-93.75 225.75-225.75 93.75-225.75-93.75-93.75-225.75 93.75-225.75 225.75-93.75zM415.5 223.5v129h129v63h-129v129h-63v-129h-129v-63h129v-129h63z" />
                                </svg>
                                <svg
                                  className="PhotoView-Slider__toolbarIcon"
                                  width="44"
                                  height="44"
                                  viewBox="0 0 768 768"
                                  fill="white"
                                  onClick={() => onScale(scale - 0.5)}
                                >
                                  <path d="M384 640.5q105 0 180.75-75.75t75.75-180.75-75.75-180.75-180.75-75.75-180.75 75.75-75.75 180.75 75.75 180.75 180.75 75.75zM384 64.5q132 0 225.75 93.75t93.75 225.75-93.75 225.75-225.75 93.75-225.75-93.75-93.75-225.75 93.75-225.75 225.75-93.75zM223.5 352.5h321v63h-321v-63z" />
                                </svg>
                              </>
                            );
                          }}
                        >
                          <PhotoView src={property.image ?? undefined}>
                            <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300">
                              <img
                                width={448}
                                height={224}
                                src={property.image ?? ""}
                                alt={`${property.project.name} project image`}
                                className="w-full h-56 sm:h-64 object-cover object-center transition-all duration-300 ease-in-out group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          </PhotoView>
                        </PhotoProvider>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="text-center">
                          <MdHome className="text-gray-400 dark:text-gray-500 text-5xl mx-auto mb-3" />
                          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">No image available</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Expand/Compress Button - positioned correctly for both states */}
                  <button
                    onClick={() => setIsImageExpanded(!isImageExpanded)}
                    className={`p-2 bg-white bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 transition-all z-9999 ${
                      isImageExpanded 
                        ? 'fixed top-6 right-6' 
                        : 'absolute top-4 right-4'
                    }`}
                  >
                    {isImageExpanded ? <FaCompress size={16} /> : <FaExpand size={16} />}
                  </button>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Project Info */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <FaBuilding className="text-blue-500" size={20} />
                      <h3 className="font-semibold text-gray-900">Projet</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Nom du projet</p>
                        <p className="font-medium text-gray-900">{property.project.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Adresse</p>
                        <p className="font-medium text-gray-900">{property.project.address || "Non spécifiée"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Progression des travaux</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <ProgressBar
                              progress={property.project.progress || 0}
                              size="sm"
                              label="none"
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {property.project.progress || 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <FaHome className="text-green-500" size={20} />
                      <h3 className="font-semibold text-gray-900">Caractéristiques</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(property.type)}
                          <p className="font-medium text-gray-900">{getTypeLabel(property.type)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Surface habitable</p>
                        <p className="font-medium text-gray-900">
                          {property.habitable ? `${property.habitable} m²` : "Non spécifiée"}
                        </p>
                      </div>
                      {property.type === "APARTMENT" && property.floor && (
                        <div>
                          <p className="text-sm text-gray-500">Étage</p>
                          <p className="font-medium text-gray-900">{property.floor}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500">Zone</p>
                        <p className="font-medium text-gray-900">{property.zone || "Non spécifiée"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <MdAttachMoney className="text-green-500" size={20} />
                      <h3 className="font-semibold text-gray-900">Prix</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Prix total</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(property.prixTotal)}
                        </p>
                      </div>
                      {property.prixM2 && (
                        <div>
                          <p className="text-sm text-gray-500">Prix au m²</p>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(property.prixM2)}/m²
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Client Info (if available) */}
                {property.client && (
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <FaUser className="text-purple-500" size={20} />
                      <h3 className="font-semibold text-gray-900">Client</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Nom complet</p>
                        <p className="font-medium text-gray-900">
                          {property.client.firstName} {property.client.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{property.client.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium text-gray-900">{property.client.phoneNumber}</p>
                      </div>
                      {property.client.whatsappNumber && (
                        <div>
                          <p className="text-sm text-gray-500">WhatsApp</p>
                          <p className="font-medium text-gray-900">{property.client.whatsappNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="p-6 space-y-6">
                {/* Surface Details */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Surfaces</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {property.habitable !== undefined && property.habitable > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <FaRulerCombined className="text-blue-500" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Surface habitable</p>
                          <p className="font-semibold text-gray-900">{property.habitable} m²</p>
                        </div>
                      </div>
                    )}
                    {property.balcon !== undefined && property.balcon > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <MdBalcony className="text-green-500" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Balcon</p>
                          <p className="font-semibold text-gray-900">{property.balcon} m²</p>
                        </div>
                      </div>
                    )}
                    {property.terrasse !== undefined && property.terrasse > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                        <FaLayerGroup className="text-orange-500" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Terrasse</p>
                          <p className="font-semibold text-gray-900">{property.terrasse} m²</p>
                        </div>
                      </div>
                    )}
                    {property.piscine !== undefined && property.piscine > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <MdPool className="text-blue-500" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Piscine</p>
                          <p className="font-semibold text-gray-900">{property.piscine} m²</p>
                        </div>
                      </div>
                    )}
                    {property.totalArea !== undefined && property.totalArea > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <FaRulerCombined className="text-purple-500" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Surface totale</p>
                          <p className="font-semibold text-gray-900">{property.totalArea} m²</p>
                        </div>
                      </div>
                    )}
                    {property.mezzanineArea !== undefined && property.mezzanineArea > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                        <FaLayerGroup className="text-indigo-500" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Mezzanine</p>
                          <p className="font-semibold text-gray-900">{property.mezzanineArea} m²</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Features */}
                {(property.parkingDisponible !== undefined && property.parkingInclus !== undefined) && (
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">Parking</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <FaParking className="text-gray-500" size={20} />
                        <span className="text-sm text-gray-600">
                          {property.parkingDisponible ? "Disponible" : "Non disponible"}
                        </span>
                      </div>
                      {property.parkingInclus && (
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-500" size={16} />
                          <span className="text-sm text-gray-600">Inclus dans le prix</span>
                        </div>
                      )}
                      {property.prixParking !== undefined && property.prixParking > 0 && (
                        <div>
                          <p className="text-sm text-gray-500">Prix du parking</p>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(property.prixParking)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {property.notes && (
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">Notes</h3>
                    <p className="text-gray-700 leading-relaxed">{property.notes}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="p-6 space-y-6">
                {/* Price Breakdown */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Détail du prix</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Prix total</span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(property.prixTotal)}
                      </span>
                    </div>
                    
                    {property.piscine && property.piscine > 0 && property.prixPiscine && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Piscine ({property.piscine} m²)</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(property.piscine * property.prixPiscine)}
                        </span>
                      </div>
                    )}
                    
                    {property.parkingDisponible && property.prixParking && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Parking</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(property.prixParking)}
                        </span>
                      </div>
                    )}
                    
                    {property.commissionPerM2 && property.habitable && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Commission</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(property.commissionPerM2 * property.habitable)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Fees */}
                {property.project.folderFees && (
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">Frais de dossier</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Frais de dossier du projet</span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatCurrency(property.project.folderFees)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Payment History */}
                {property.payments && property.payments.payments.length > 0 && (
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">Historique des paiements</h3>
                    <div className="space-y-3">
                      {property.payments.payments.map((payment, index) => (
                        <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">
                              Paiement {index + 1}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(payment.dueDate).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(payment.amount)}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              payment.status === 'PAID' 
                                ? 'bg-green-100 text-green-800' 
                                : payment.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {payment.status === 'PAID' ? 'Payé' : 
                               payment.status === 'PENDING' ? 'En attente' : 'En retard'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="p-6 space-y-6">
                {/* Available Documents */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Documents disponibles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <FaFileAlt className="text-blue-500" size={20} />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Plan de la propriété</p>
                        <p className="text-sm text-gray-500">PDF • 2.3 MB</p>
                      </div>
                      <FaDownload className="text-gray-400 hover:text-blue-500 transition-colors" size={16} />
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <FaFileAlt className="text-green-500" size={20} />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Contrat de vente</p>
                        <p className="text-sm text-gray-500">PDF • 1.8 MB</p>
                      </div>
                      <FaDownload className="text-gray-400 hover:text-green-500 transition-colors" size={16} />
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <FaFileAlt className="text-purple-500" size={20} />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Fiche technique</p>
                        <p className="text-sm text-gray-500">PDF • 1.2 MB</p>
                      </div>
                      <FaDownload className="text-gray-400 hover:text-purple-500 transition-colors" size={16} />
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <FaFileAlt className="text-orange-500" size={20} />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Plan du projet</p>
                        <p className="text-sm text-gray-500">PDF • 3.1 MB</p>
                      </div>
                      <FaDownload className="text-gray-400 hover:text-orange-500 transition-colors" size={16} />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Actions rapides</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <FaPrint size={16} />
                      Imprimer
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <FaShare size={16} />
                      Partager
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                      <FaDownload size={16} />
                      Télécharger tout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500">
              Dernière mise à jour: {property.updatedAt ? new Date(property.updatedAt).toLocaleDateString('fr-FR') : 'Non disponible'}
            </div>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Imprimer
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PropertyDetailsModal; 