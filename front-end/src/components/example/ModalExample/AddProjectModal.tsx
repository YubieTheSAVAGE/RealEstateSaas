"use client";
import React, { useState } from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import addProject from "@/app/(admin)/projects/addProjects";
import TextArea from "@/components/form/input/TextArea";
import FileInput from "@/components/form/input/FileInput";
import Alert from "@/components/ui/alert/Alert";
import { DollarLineIcon, UserIcon, BoxIcon, FileIcon } from "@/icons";
import { CiLocationOn } from "react-icons/ci";
import Select from "@/components/form/Select";

interface AddProjectModalProps {
  onProjectAdded?: () => void; // Callback to refresh project list
}

export default function AddProjectModal({ onProjectAdded }: AddProjectModalProps) {
  const { isOpen, openModal, closeModal } = useModal();

  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    numberOfApartments: "",
    notes: "",
    totalSurface: "",
    address: "",
    latitude: "",
    longitude: "",
    dossierFee: "",
    agencyCommission: "",
    image: null as File | null, // Store as File object instead of string
    status: "",
  });
  // State for validation errors
  const [errors, setErrors] = useState({
    name: "",
    numberOfApartments: "",
    totalSurface: "",
    address: "",
    latitude: "",
    longitude: "",
    dossierFee: "",
    agencyCommission: "",
    image: "",
    status: "",
  });
  
  // State for API errors
  const [apiError, setApiError] = useState("");
  // Update form field values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when the user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    
    // Clear API error when user makes any changes
    if (apiError) {
      setApiError("");
    }
  };
    // Special handler for file inputs
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!file) return;
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Only JPEG, PNG, JPG, or WEBP files are allowed",
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      
      // Clear API error when user makes any changes
      if (apiError) {
        setApiError("");
      }
    }
  };
const handleSave = async () => {
  setApiError("");
  const newErrors = { ...errors };
  let hasErrors = false;

  // Validation configuration
  const validations = [
    { 
      field: 'name', 
      test: (v: string) => !v.trim(), 
      message: "le nom du projet est requis" 
    },
    { 
      field: 'numberOfApartments', 
      test: (v: string) => !v || isNaN(Number(v)) || Number(v) <= 0,
      message: "le nombre de propriétés est requis et doit être un entier positif"
    },
    { 
      field: 'totalSurface', 
      test: (v: string) => !v || isNaN(Number(v)) || Number(v) <= 0,
      message: "la surface totale est requise et doit être un nombre positif"
    },
    { 
      field: 'address', 
      test: (v: string) => !v.trim(), 
      message: "l'adresse est requise" 
    },
    { 
      field: 'latitude', 
      test: (v: string) => !v || isNaN(Number(v)),
      message: "La latitude est requise et doit être un nombre"
    },
    { 
      field: 'longitude', 
      test: (v: string) => !v || isNaN(Number(v)),
      message: "La longitude est requise et doit être un nombre"
    },
    { 
      field: 'dossierFee', 
      test: (v: string) => !v || isNaN(Number(v)) || Number(v) < 0,
      message: "Les frais de dossier sont requis et doivent être un nombre positif"
    },
    { 
      field: 'agencyCommission', 
      test: (v: string) => !v || isNaN(Number(v)) || Number(v) < 0,
      message: "La commission d'agence est requise et doit être un nombre positif"
    },
    {
      field: 'status',
      test: (v: string) => !v,
      message: "Le statut du projet est requis"
    },
  ];

  // Run validations
  validations.forEach(({ field, test, message }) => {
    if (test(formData[field as keyof typeof formData] as string)) {
      newErrors[field as keyof typeof newErrors] = message;
      hasErrors = true;
    }
  });

  if (hasErrors) return setErrors(newErrors);

  const formDataToSend = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== null && !(key === 'image' && !value)) {
      formDataToSend.append(key, value as string | Blob);
    }
  });

  try {
    await addProject(formDataToSend);
    setFormData({ name: "", numberOfApartments: "", notes: "", totalSurface: "", address: "", latitude: "", longitude: "", dossierFee: "", agencyCommission: "", image: null, status: "" });
    onProjectAdded?.();
    closeModal();
  } catch (error) {
    setApiError(error instanceof Error ? error.message : "Failed to add project");
  }
};
  const handleTextareaChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      notes: value,
    }));
    
    // Clear API error when user makes any changes
    if (apiError) {
      setApiError("");
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (apiError) {
      setApiError("");
    }
  };

  // Added logic to reset errors when the modal is closed
  const handleCloseModal = () => {
    closeModal();
    setErrors({
      name: "",
      numberOfApartments: "",
      totalSurface: "",
      address: "",
      latitude: "",
      longitude: "",
      dossierFee: "",
      agencyCommission: "",
      image: "",
      status: "",
    });
    setApiError("");
  };

  return (
    <>
      <Button size="sm" onClick={openModal}>
        Ajouter un projet
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Informations sur le projet
          </h4>
          {/* Show API errors */}
          {apiError && (
            <div className="mb-4">
              <Alert 
                title="Error"
                message={apiError}
                variant="error"
                showLink={false}
              />
            </div>
          )}
          {/* Show validation errors summary if any */}
          {Object.values(errors).some(error => error) && (
            <div className="mb-4">
              <Alert 
                title="Erreur de validation"
                message="Veuillez corriger les erreurs dans le formulaire ci-dessous."
                variant="error"
                showLink={false}
              />
            </div>
          )}
          <div className="custom-scrollbar max-h-[70vh] overflow-y-auto px-1">
            {/* Base Info Section */}
            <div className="flex items-center gap-2 mb-2 mt-2">
              <BoxIcon className="w-6 h-6 text-blue-500" />
              <span className="font-semibold text-gray-700 dark:text-white/90">Informations du base</span>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 mb-6">
              <div className="col-span-1">
                <Label>Nom <span className="text-red-500">*</span></Label>
                <Input
                  name="name"
                  type="text"
                  placeholder="le nom du projet"
                  onChange={handleChange}
                  value={formData.name}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
              <div className="col-span-1">
                <Label>Nombre total de propriétés <span className="text-red-500">*</span></Label>
                <Input
                  name="numberOfApartments"
                  type="number"
                  placeholder="e.g. 10"
                  onChange={handleChange}
                  value={formData.numberOfApartments}
                />
                {errors.numberOfApartments && (
                  <p className="text-sm text-red-500">{errors.numberOfApartments}</p>
                )}
              </div>
              <div className="col-span-1">
                <Label>Surface totale <span className="text-red-500">*</span></Label>
                <Input
                  name="totalSurface"
                  type="number"
                  placeholder="e.g. 1000 m²"
                  onChange={handleChange}
                  value={formData.totalSurface}
                />
                {errors.totalSurface && (
                  <p className="text-sm text-red-500 mt-1">{errors.totalSurface}</p>
                )}
              </div>
              <div className="col-span-1">
                <Label>Adresse <span className="text-red-500">*</span></Label>
                <Input
                  name="address"
                  type="text"
                  placeholder="e.g. 123 Main St"
                  onChange={handleChange}
                  value={formData.address}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                )}
              </div>
            </div>
            {/* Project Status Select */}
            <div className="mb-6">
              <Label>Statut du projet <span className="text-red-500">*</span></Label>
              <Select
                name="status"
                options={[
                  { value: "planification", label: "Planification" },
                  { value: "construction", label: "En construction" },
                  { value: "done", label: "Terminé" },
                ]}
                placeholder="Sélectionner le statut du projet"
                onChange={handleSelectChange}
                defaultValue={formData.status}
              />
              {errors.status && (
                <p className="text-sm text-red-500 mt-1">{errors.status}</p>
              )}
            </div>
            {/* Location Section */}
            <div className="flex items-center gap-2 mb-2 mt-2">
              <CiLocationOn className="w-6 h-6 text-green-500" />
              <span className="font-semibold text-gray-700 dark:text-white/90">Localisation</span>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 mb-6">
              <div className="col-span-1">
                <Label>Latitude <span className="text-red-500">*</span></Label>
                <Input
                  name="latitude"
                  type="number"
                  placeholder="e.g. 35.5731"
                  onChange={handleChange}
                  value={formData.latitude}
                />
                {errors.latitude && (
                  <p className="text-sm text-red-500 mt-1">{errors.latitude}</p>
                )}
              </div>
              <div className="col-span-1">
                <Label>Longitude <span className="text-red-500">*</span></Label>
                <Input
                  name="longitude"
                  type="number"
                  placeholder="e.g. -7.573871"
                  onChange={handleChange}
                  value={formData.longitude}
                />
                {errors.longitude && (
                  <p className="text-sm text-red-500 mt-1">{errors.longitude}</p>
                )}
              </div>
            </div>
            {/* Fees Section */}
            <div className="flex items-center gap-2 mb-2 mt-2">
              <DollarLineIcon className="w-6 h-6 text-yellow-500" />
              <span className="font-semibold text-gray-700 dark:text-white/90">Frais</span>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 mb-6">
              <div className="col-span-1">
                <Label>Frais de dossier <span className="text-red-500">*</span></Label>
                <Input
                  name="dossierFee"
                  type="number"
                  placeholder="e.g. 12345"
                  onChange={handleChange}
                  value={formData.dossierFee}
                />
                {errors.dossierFee && (
                  <p className="text-sm text-red-500 mt-1">{errors.dossierFee}</p>
                )}
              </div>
              <div className="col-span-1">
                <Label>Commission d'agence <span className="text-red-500">*</span></Label>
                <Input
                  name="agencyCommission"
                  type="number"
                  placeholder="% 2"
                  onChange={handleChange}
                  value={formData.agencyCommission}
                />
                {errors.agencyCommission && (
                  <p className="text-sm text-red-500 mt-1">{errors.agencyCommission}</p>
                )}
              </div>
            </div>
            {/* Structure Section (Plan) */}
            <div className="flex items-center gap-2 mb-2 mt-2">
              <FileIcon className="w-6 h-6 text-purple-500" />
              <span className="font-semibold text-gray-700 dark:text-white/90">Plan</span>
            </div>
            <div className="mb-6">
              <FileInput
                name="image"
                onChange={handleFileChange}
              />
              {formData.image && (
                <p className="mt-1 text-xs text-green-600">Fichier sélectionné : {formData.image.name}</p>
              )}
              {errors.image && (
                <p className="text-sm text-red-500 mt-1">{errors.image}</p>
              )}
            </div>
            {/* Notes Section */}
            <div className="flex items-center gap-2 mb-2 mt-2">
              <UserIcon className="w-6 h-6 text-pink-500" />
              <span className="font-semibold text-gray-700 dark:text-white/90">Notes</span>
            </div>
            <div className="mb-6">
              <TextArea
                value={formData.notes}
                name="notes"
                placeholder="Saisissez votre notes here..."
                rows={6}
                onChange={handleTextareaChange}
              />
            </div>
          </div>
          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Fermer
            </Button>
            <Button size="sm" onClick={handleSave}>
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}