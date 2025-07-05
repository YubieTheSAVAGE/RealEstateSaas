import React, { useState } from "react";
import { Property } from "@/types/property";
import { PhotoProvider, PhotoView } from "react-photo-view";
import 'react-photo-view/dist/react-photo-view.css';
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import EditPropertyModal from "@/components/example/ModalExample/EditApartmentsModal";
import DeleteModal from "@/components/example/ModalExample/DeleteModal";
import deleteApartement from "@/components/tables/DataTables/Properties/deleteApartement";
import { useRouter } from "next/navigation";
import { FaBuilding, FaHashtag, FaMapMarkerAlt, FaCheckCircle, FaUser, FaRulerCombined, FaCouch, FaUmbrellaBeach, FaWarehouse, FaCar, FaStickyNote, FaHome, FaStore, FaSeedling } from 'react-icons/fa';
import ReservationProcessModal from "@/components/example/ModalExample/ReservationProcessModal";
import { Payment } from "@/types/Payment";

// Test payments array for testing the conditional logic
const testPayments: Payment[] = [
  {
    id: 1,
    amount: 50000,
    dueDate: new Date('2024-03-15'),
    status: 'PENDING',
    proofOfPayment: null,
    property: {
      id: 1,
      number: 'A101',
      type: 'APARTMENT',
      status: 'RESERVED',
      project: {
        id: 1,
        name: 'Résidence Les Palmiers',
        address: 'Avenue Mohammed V, Casablanca',
        numberOfApartments: 120,
        totalSurface: 15000,
        latitude: 33.5779,
        longitude: -7.5911,
        folderFees: 10000,
        status: "construction",
        progress: 60,
      },
      prixTotal: 250000,
      client: {
        id: 1,
        name: 'Ahmed Benali',
        firstName: 'Ahmed',
        lastName: 'Benali',
        email: 'ahmed.benali@email.com',
        phoneNumber: '+212661234567',
        provenance: 'Website',
        status: 'CLIENT',
        createdById: 1,
      }
    },
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    isFirstPayment: true,
    percentageOfTotal: 20
  },
  {
    id: 2,
    amount: 50000,
    dueDate: new Date('2024-04-15'),
    status: 'PENDING',
    proofOfPayment: null,
    property: {
      id: 1,
      number: 'A101',
      type: 'APARTMENT',
      status: 'RESERVED',
      project: {
        id: 1,
        name: 'Résidence Les Palmiers',
        address: 'Avenue Mohammed V, Casablanca',
        numberOfApartments: 120,
        totalSurface: 15000,
        latitude: 33.5779,
        longitude: -7.5911,
        folderFees: 10000,
        status: "construction",
        progress: 60,
      },
      prixTotal: 250000,
      client: {
        id: 1,
        name: 'Ahmed Benali',
        firstName: 'Ahmed',
        lastName: 'Benali',
        email: 'ahmed.benali@email.com',
        phoneNumber: '+212661234567',
        provenance: 'Website',
        status: 'CLIENT',
        createdById: 1,
      }
    },
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    isFirstPayment: false,
    percentageOfTotal: 20
  },
  {
    id: 3,
    amount: 75000,
    dueDate: new Date('2024-05-15'),
    status: 'PENDING',
    proofOfPayment: null,
    property: {
      id: 1,
      number: 'A101',
      type: 'APARTMENT',
      status: 'RESERVED',
      project: {
        id: 1,
        name: 'Résidence Les Palmiers',
        address: 'Avenue Mohammed V, Casablanca',
        numberOfApartments: 120,
        totalSurface: 15000,
        latitude: 33.5779,
        longitude: -7.5911,
        folderFees: 10000,
        status: "construction",
        progress: 60,
      },
      prixTotal: 250000,
      client: {
        id: 1,
        name: 'Ahmed Benali',
        firstName: 'Ahmed',
        lastName: 'Benali',
        email: 'ahmed.benali@email.com',
        phoneNumber: '+212661234567',
        provenance: 'Website',
        status: 'CLIENT',
        createdById: 1,
      }
    },
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    isFirstPayment: false,
    percentageOfTotal: 30
  },
  {
    id: 4,
    amount: 75000,
    dueDate: new Date('2024-06-15'),
    status: 'PENDING',
    proofOfPayment: null,
    property: {
      id: 1,
      number: 'A101',
      type: 'APARTMENT',
      status: 'RESERVED',
      project: {
        id: 1,
        name: 'Résidence Les Palmiers',
        address: 'Avenue Mohammed V, Casablanca',
        numberOfApartments: 120,
        totalSurface: 15000,
        latitude: 33.5779,
        longitude: -7.5911,
        folderFees: 10000,
        status: "construction",
        progress: 60,
      },
      prixTotal: 250000,
      client: {
        id: 1,
        name: 'Ahmed Benali',
        firstName: 'Ahmed',
        lastName: 'Benali',
        email: 'ahmed.benali@email.com',
        phoneNumber: '+212661234567',
        provenance: 'Website',
        status: 'CLIENT',
        createdById: 1,
      }
    },
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    isFirstPayment: false,
    percentageOfTotal: 30
  }
];

// Alternative test data for different scenarios:
// 1. No payments (empty array) - should show ReservationProcessModal
const noPayments: Payment[] = [];

// 2. Payments for different property - should show ReservationProcessModal
const paymentsForDifferentProperty: Payment[] = [
  {
    id: 5,
    amount: 60000,
    dueDate: new Date('2024-03-20'),
    status: 'PENDING',
    proofOfPayment: null,
    property: {
      id: 2, // Different property ID
      number: 'A102',
      type: 'APARTMENT',
      status: 'RESERVED',
      project: {
        id: 1,
        name: 'Résidence Les Palmiers',
        address: 'Avenue Mohammed V, Casablanca',
        numberOfApartments: 120,
        totalSurface: 15000,
        latitude: 33.5779,
        longitude: -7.5911,
        folderFees: 10000,
        status: "construction",
        progress: 60,
      },
      prixTotal: 300000,
      client: {
        id: 1,
        name: 'Ahmed Benali',
        firstName: 'Ahmed',
        lastName: 'Benali',
        email: 'ahmed.benali@email.com',
        phoneNumber: '+212661234567',
        provenance: 'Website',
        status: 'CLIENT',
        createdById: 1,
      }
    },
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
    isFirstPayment: true,
    percentageOfTotal: 20
  }
];

interface PropertyCardProps {
  property: Property;
  onRefresh?: () => void; // Callback to refresh property list after editing
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onRefresh }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (!property) {
    return (
      <div className="flex items-center justify-center h-[160px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-400 dark:text-gray-500">
        Aucune donnée disponible
      </div>
    );
  }
  
  {/* test payments */}
  // property.client!.payments = testPayments;

  // Property type mapping
  const typeMap = {
    "APARTMENT": "Appartement",
    "VILLA": "Villa", 
    "DUPLEX": "Duplex",
    "STORE": "Magasin",
    "LAND": "Terrain",
  };

  // Property type icon mapping
  const typeIconMap = {
    "APARTMENT": FaBuilding,
    "VILLA": FaHome,
    "DUPLEX": FaBuilding,
    "STORE": FaStore,
    "LAND": FaSeedling,
  };

  // Get type display info
  const typeDisplay = typeMap[property.type as keyof typeof typeMap] || property.type;
  const TypeIcon = typeIconMap[property.type as keyof typeof typeIconMap] || FaBuilding;

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  function closeDropdown() {
    setIsOpen(false);
  }

  const handleDelete = async (id: string) => {
    // Implement delete logic here
    const success: boolean = await deleteApartement(id);
    if (!success) {
      console.error("Error deleting property");
      return;
    }
    router.push("/properties");// Call the delete function and handle success or error
  }

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 shadow-sm dark:shadow-gray-900/20">
      {/* Left: Details */}
      <div className="flex-1 flex flex-col gap-4 min-w-[320px]">
        {/* General Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3 flex items-center gap-2">
            <TypeIcon className="text-teal-400 dark:text-teal-300" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Type</div>
              <div className="font-bold text-lg text-gray-900 dark:text-white">{typeDisplay}</div>
            </div>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 flex items-center gap-2">
            <FaHashtag className="text-indigo-400 dark:text-indigo-300" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Numéro</div>
              <div className="font-bold text-lg text-gray-900 dark:text-white">{property.number}</div>
            </div>
          </div>
          {(property.type === 'APARTMENT') && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex items-center gap-2">
              <FaBuilding className="text-blue-400 dark:text-blue-300" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Étage</div>
                <div className="font-bold text-lg text-gray-900 dark:text-white">{property.floor ?? '-'}</div>
              </div>
            </div>
          )}
          {(property.type === 'APARTMENT' || property.type === 'VILLA' || property.type === 'DUPLEX') && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 flex items-center gap-2">
              <FaMapMarkerAlt className="text-purple-400 dark:text-purple-300" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Zone</div>
                <div className="font-bold text-lg text-gray-900 dark:text-white">{property.zone ?? '-'}</div>
              </div>
            </div>
          )}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 flex items-center gap-2">
            <FaCheckCircle className="text-green-400 dark:text-green-300" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Statut</div>
              <div className="font-bold text-lg text-gray-900 dark:text-white">
                {property.status === 'AVAILABLE' ? 'Disponible' : property.status === 'RESERVED' ? 'Réservé' : property.status === 'SOLD' ? 'Vendu' : 'Inconnu'}
              </div>
            </div>
          </div>
        </div>
        {/* Reservation/Client */}
        {property.status === 'RESERVED' && property.client && (
          <>
            {/* Check if client has payments for this property */}
            {(!property.client.payments || property.client.payments.length === 0 || 
              !property.client.payments.some(payment => payment.property.id === property.id)) ? (
              <ReservationProcessModal property={property} payments={property.client.payments || []} />
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 flex items-center gap-2 mt-1">
                <FaUser className="text-yellow-400 dark:text-yellow-700" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Réservé à</div>
                  <div className="font-bold text-base text-gray-900 dark:text-white">{property.client?.name}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">Client réservataire</div>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Sold Property Handling - Fixed to remove duplicate */}
        {property.status === 'SOLD' && property.client && (
          <>
            {/* Check if client has payments for this property */}
            {(!property.client.payments || property.client.payments.length === 0 || 
              !property.client.payments.some(payment => payment.property.id === property.id)) ? (
              <ReservationProcessModal property={property} payments={property.client.payments || []} />
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 flex items-center gap-2 mt-1">
                <FaCheckCircle className="text-red-400 dark:text-red-300" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Vendu à</div>
                  <div className="font-bold text-base text-gray-900 dark:text-white">{property.client?.name}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">Client acheteur</div>
                </div>
              </div>
            )}
          </>
        )}
        {/* Surfaces & Espaces */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          {property.habitable !== undefined && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 flex items-center gap-2">
              <FaRulerCombined className="text-green-400 dark:text-green-300" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Superficie</div>
                <div className="font-bold text-lg text-gray-900 dark:text-white">{property.habitable} m²</div>
              </div>
            </div>
          )}
          {property.balcon !== undefined && property.balcon > 0 && (
            <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3 flex items-center gap-2">
              <FaCouch className="text-cyan-400 dark:text-cyan-300" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Balcon</div>
                <div className="font-bold text-lg text-gray-900 dark:text-white">{property.balcon} m²</div>
              </div>
            </div>
          )}
          {property.terrasse !== undefined && property.terrasse > 0 && (
            <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-3 flex items-center gap-2">
              <FaUmbrellaBeach className="text-pink-400 dark:text-pink-300" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Terrasse</div>
                <div className="font-bold text-lg text-gray-900 dark:text-white">{property.terrasse} m²</div>
              </div>
            </div>
          )}
          {property.mezzanineArea !== undefined && property.mezzanineArea > 0 && (
            <div className="bg-lime-50 dark:bg-lime-900/20 rounded-lg p-3 flex items-center gap-2">
              <FaWarehouse className="text-lime-400 dark:text-lime-300" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Mezzanine</div>
                <div className="font-bold text-lg text-gray-900 dark:text-white">{property.mezzanineArea} m²</div>
              </div>
            </div>
          )}
          {property.piscine !== undefined && property.piscine > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex items-center gap-2">
              <FaUmbrellaBeach className="text-blue-400 dark:text-blue-300" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Piscine</div>
                <div className="font-bold text-lg text-gray-900 dark:text-white">{property.piscine} m²</div>
              </div>
            </div>
          )}
          {property.totalArea !== undefined && (
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 flex items-center gap-2">
              <FaWarehouse className="text-orange-400 dark:text-orange-300" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Surface totale</div>
                <div className="font-bold text-lg text-gray-900 dark:text-white">{property.totalArea} m²</div>
              </div>
            </div>
          )}
          {(property.type === 'APARTMENT' || property.type === 'VILLA' || property.type === 'DUPLEX') && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 flex items-center gap-2">
              <FaCar className="text-yellow-400 dark:text-yellow-300" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Parking</div>
                <div className="font-bold text-lg text-gray-900 dark:text-white">
                  {property.parkingInclus ? 'inclus' : property.parkingDisponible ? 'disponible' : 'non disponible'}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Notes */}
        {property.notes && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 flex items-center gap-2 mt-2">
            <FaStickyNote className="text-gray-400 dark:text-gray-500" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Notes</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">{property.notes}</div>
            </div>
          </div>
        )}
      </div>
      {/* Right: Image & Summary */}
      <div className="flex flex-col gap-4 w-full md:w-[420px] max-w-[480px]">
        {/* Actions Dropdown */}
        <div className="flex justify-end">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <EditPropertyModal PropertyData={property} details={true} onRefresh={handleRefresh} />
            <DeleteModal 
              itemId={property?.id?.toString() || ''} 
              heading="Supprimer le bien" 
              description="Êtes-vous sûr de vouloir supprimer ce bien ? Cette action est irréversible." 
              onDelete={() => handleDelete(property?.id?.toString() || '')} 
              details={true} 
            />
          </Dropdown>
        </div>
        {/* Property Image */}
        <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center h-48">
          {property.image ? (
            <PhotoProvider>
              <PhotoView src={property.image}>
                <img src={property.image} alt="property" className="object-cover w-full h-48" />
              </PhotoView>
            </PhotoProvider>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 text-lg">Aucune image disponible</span>
          )}
        </div>
        {/* Summary */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Projet</span>
            <span className="bg-gray-200 dark:bg-gray-600 rounded px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300">{property.project?.name ?? '-'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Type de prix</span>
            <span className="text-blue-500 dark:text-blue-400 font-semibold text-sm">
              {property.prixType === 'FIXE' ? 'Prix fixe' : property.prixType === 'M2' ? 'Prix au m²' : '-'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Prix Total</span>
            <span className="text-green-600 dark:text-green-400 font-bold text-lg">
              {property.prixTotal?.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} MAD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
