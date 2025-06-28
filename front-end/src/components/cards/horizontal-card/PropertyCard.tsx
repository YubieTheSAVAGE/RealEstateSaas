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
import { FaBuilding, FaHashtag, FaMapMarkerAlt, FaCheckCircle, FaUser, FaRulerCombined, FaCouch, FaUmbrellaBeach, FaWarehouse, FaCar, FaStickyNote } from 'react-icons/fa';

interface PropertyCardProps {
  property: Property;
  onRefresh?: () => void; // Callback to refresh property list after editing
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onRefresh }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  function closeDropdown() {
    setIsOpen(false);
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center h-[160px] w-full bg-gray-100 rounded-lg text-gray-400">
        Aucune donnée disponible
      </div>
    );
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
    <div className="flex flex-col md:flex-row gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Left: Details */}
      <div className="flex-1 flex flex-col gap-4 min-w-[320px]">
        {/* General Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-2">
            <FaBuilding className="text-blue-400" />
            <div>
              <div className="text-xs text-gray-500">Étage</div>
              <div className="font-bold text-lg">{property.floor ?? '-'}</div>
            </div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3 flex items-center gap-2">
            <FaHashtag className="text-indigo-400" />
            <div>
              <div className="text-xs text-gray-500">Numéro</div>
              <div className="font-bold text-lg">{property.number}</div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 flex items-center gap-2">
            <FaMapMarkerAlt className="text-purple-400" />
            <div>
              <div className="text-xs text-gray-500">Zone</div>
              <div className="font-bold text-lg">{property.zone ?? '-'}</div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 flex items-center gap-2">
            <FaCheckCircle className="text-green-400" />
            <div>
              <div className="text-xs text-gray-500">Statut</div>
              <div className="font-bold text-lg">
                {property.status === 'AVAILABLE' ? 'Disponible' : property.status === 'RESERVED' ? 'Réservé' : property.status === 'SOLD' ? 'Vendu' : 'Inconnu'}
              </div>
            </div>
          </div>
        </div>
        {/* Reservation/Client */}
        {property.status === 'RESERVED' && property.client && (
          <div className="bg-yellow-50 rounded-lg p-3 flex items-center gap-2 mt-1">
            <FaUser className="text-yellow-400" />
            <div>
              <div className="text-xs text-gray-500">Réservé à</div>
              <div className="font-bold text-base">{property.client.name}</div>
              <div className="text-xs text-gray-400">Client réservataire</div>
            </div>
          </div>
        )}
        {/* Surfaces & Espaces */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          {property.habitable !== undefined && (
            <div className="bg-green-50 rounded-lg p-3 flex items-center gap-2">
              <FaRulerCombined className="text-green-400" />
              <div>
                <div className="text-xs text-gray-500">Superficie</div>
                <div className="font-bold text-lg">{property.habitable} m²</div>
              </div>
            </div>
          )}
          {property.balcon !== undefined && property.balcon > 0 && (
            <div className="bg-cyan-50 rounded-lg p-3 flex items-center gap-2">
              <FaCouch className="text-cyan-400" />
              <div>
                <div className="text-xs text-gray-500">Balcon</div>
                <div className="font-bold text-lg">{property.balcon} m²</div>
              </div>
            </div>
          )}
          {property.terrasse !== undefined && property.terrasse > 0 && (
            <div className="bg-pink-50 rounded-lg p-3 flex items-center gap-2">
              <FaUmbrellaBeach className="text-pink-400" />
              <div>
                <div className="text-xs text-gray-500">Terrasse</div>
                <div className="font-bold text-lg">{property.terrasse} m²</div>
              </div>
            </div>
          )}
          {property.totalArea !== undefined && (
            <div className="bg-orange-50 rounded-lg p-3 flex items-center gap-2">
              <FaWarehouse className="text-orange-400" />
              <div>
                <div className="text-xs text-gray-500">Surface totale</div>
                <div className="font-bold text-lg">{property.totalArea} m²</div>
              </div>
            </div>
          )}
          <div className="bg-yellow-50 rounded-lg p-3 flex items-center gap-2">
            <FaCar className="text-yellow-400" />
            <div>
              <div className="text-xs text-gray-500">Parking</div>
              <div className="font-bold text-lg">{property.parkingInclus ? 'inclus' : property.parkingDisponible ? 'disponible' : 'non inclus'}</div>
            </div>
          </div>
        </div>
        {/* Notes */}
        {property.notes && (
          <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2 mt-2">
            <FaStickyNote className="text-gray-400" />
            <div>
              <div className="text-xs text-gray-500">Notes</div>
              <div className="text-sm text-gray-700">{property.notes}</div>
            </div>
          </div>
        )}
      </div>
      {/* Right: Image & Summary */}
      <div className="flex flex-col gap-4 w-full md:w-[420px] max-w-[480px]">
        {/* Property Image */}
        <div className="rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center h-48">
          {property.image ? (
            <PhotoProvider>
              <PhotoView src={property.image}>
                <img src={property.image} alt="property" className="object-cover w-full h-48" />
              </PhotoView>
            </PhotoProvider>
          ) : (
            <span className="text-gray-400 text-lg">Aucune image disponible</span>
          )}
        </div>
        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Projet</span>
            <span className="bg-gray-200 rounded px-2 py-1 text-xs font-semibold">{property.project?.name ?? '-'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Type de prix</span>
            <span className="text-blue-500 font-semibold text-sm">
              {property.prixType === 'FIXE' ? 'Prix fixe' : property.prixType === 'M2' ? 'Prix au m²' : '-'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Prix Total</span>
            <span className="text-green-600 font-bold text-lg">
              {property.prixTotal?.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} DH
            </span>
          </div>
        </div>
        {/* Actions Dropdown */}
        <div className="flex justify-end">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
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
      </div>
    </div>
  );
};

export default PropertyCard;
