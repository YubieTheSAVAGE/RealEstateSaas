"use client";
import React, { useState } from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import editProject from "@/app/(admin)/projects/editProjects";
import TextArea from "@/components/form/input/TextArea";
import FileInput from "@/components/form/input/FileInput";
import Alert from "@/components/ui/alert/Alert";
import { PencilIcon } from "@/icons";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { Project } from "@/types/project";

interface EditProjectModalProps {
  ProjectData?: Project; // Add the type for ProjectData if available
  onRefresh?: () => void; // Callback to refresh project list after editing
  details?: boolean
}

export default function EditProjectModal({ ProjectData, onRefresh, details }: EditProjectModalProps) {
  const { isOpen, openModal, closeModal } = useModal();
  // State for form fields
  const [formData, setFormData] = useState({
    id: ProjectData?.id || "",
    name: ProjectData?.name || "",
    numberOfApartments: ProjectData?.numberOfApartments || "",
    notes: ProjectData?.notes || "",
    totalSurface: ProjectData?.totalSurface || "",
    address: ProjectData?.address || "",
    image: null as File | null, // Store as File object instead of string
  });
  console.log("ProjectData", ProjectData);
  console.log("formData", formData);

  // State for validation errors
  const [errors, setErrors] = useState({
    name: "",
    numberOfApartments: "",
    totalSurface: "",
    address: "",
    image: "",
  });

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
  };

  // Special handler for file inputs
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

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

      // Clear image error
      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  const handleSave = async () => {
    const newErrors = { ...errors };
    let hasErrors = false;

    // Validation rules
    if (!formData.name.trim()) {
      newErrors.name = "Le nom du projet est requis";
      hasErrors = true;
    }

    if (
      !formData.numberOfApartments ||
      isNaN(Number(formData.numberOfApartments)) ||
      Number(formData.numberOfApartments) <= 0
    ) {
      newErrors.numberOfApartments = "Le nombre de biens est requis et doit être un nombre entier positif";
      hasErrors = true;
    }

    if (
      !formData.totalSurface ||
      isNaN(Number(formData.totalSurface)) ||
      Number(formData.totalSurface) <= 0
    ) {
      newErrors.totalSurface = "La surface totale est requise et doit être un nombre positif";
      hasErrors = true;
    }

    if (!formData.address.trim()) {
      newErrors.address = "L'adresse est requise";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && !(key === "image" && !value)) {
        formDataToSend.append(key, value as string | Blob);
      }
    });

    try {
      await editProject(formDataToSend);

      // Call the callback to refresh project list if provided
      if (onRefresh) {
        onRefresh();
      }

      closeModal();
    } catch (error) {
      console.error("Error saving project:", error);

    }
  };

  const handleTextareaChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      notes: value,
    }));
  };

  return (
    <>
      {details ? (
        <DropdownItem onItemClick={openModal}>
          Modifier
        </DropdownItem>
      ) : (
        <span className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 cursor-pointer">
          <PencilIcon onClick={openModal} />
        </span>
      )}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10 z-99999"
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <h4 className="mb-2 text-lg font-medium text-gray-800 dark:text-white/90">
            Informations du projet
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Modifiez les détails du projet ci-dessous.
          </p>

          {/* Validation Errors Summary */}
          {Object.values(errors).some((error) => error) && (
            <div className="mb-4">
              <Alert
                title="Erreur de validation"
                message="Veuillez corriger les erreurs dans le formulaire ci-dessous."
                variant="error"
                showLink={false}
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1">
              <Label>Nom <span className="text-red-500">*</span></Label>
              <Input
                value={formData.name}
                name="name"
                type="text"
                placeholder="Nom du projet"
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="col-span-1">
              <Label>Nombre total de biens <span className="text-red-500">*</span></Label>
              <Input
                value={formData.numberOfApartments}
                name="numberOfApartments"
                type="number"
                placeholder="ex: 10"
                onChange={handleChange}
              />
              {errors.numberOfApartments && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.numberOfApartments}
                </p>
              )}
            </div>

            <div className="col-span-1">
              <Label>Surface totale <span className="text-red-500">*</span></Label>
              <Input
                value={formData.totalSurface}
                name="totalSurface"
                type="number"
                placeholder="ex: 1000 m²"
                onChange={handleChange}
              />
              {errors.totalSurface && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.totalSurface}
                </p>
              )}
            </div>

            <div className="col-span-1">
              <Label>Adresse <span className="text-red-500">*</span></Label>
              <Input
                value={formData.address}
                name="address"
                type="text"
                placeholder="ex: 123 Rue Principale"
                onChange={handleChange}
              />
              {errors.address && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.address}
                </p>
              )}
            </div>

            <div className="col-span-1 sm:col-span-2">
              <Label>Plan</Label>
              <FileInput
                onChange={handleFileChange}
              />
              {formData.image && (
                <p className="text-sm text-green-500 mt-1">
                  Fichier sélectionné: {formData.image.name}
                </p>
              )}
              {errors.image && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.image}
                </p>
              )}
            </div>

            <div className="col-span-1 sm:col-span-2">
              <Label>Note</Label>
              <TextArea
                value={formData.notes}
                name="notes"
                placeholder="Tapez une note ici..."
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
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}