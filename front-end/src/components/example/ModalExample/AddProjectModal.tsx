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
    image: null as File | null, // Store as File object instead of string
  });
  // State for validation errors
  const [errors, setErrors] = useState({
    name: "",
    numberOfApartments: "",
    totalSurface: "",
    address: "",
    image:""
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
      message: "Project name is required" 
    },
    { 
      field: 'numberOfApartments', 
      test: (v: string) => !v || isNaN(Number(v)) || Number(v) <= 0,
      message: "Number of properties is required and must be a positive integer"
    },
    { 
      field: 'totalSurface', 
      test: (v: string) => !v || isNaN(Number(v)) || Number(v) <= 0,
      message: "Total surface is required and must be a positive number"
    },
    { 
      field: 'address', 
      test: (v: string) => !v.trim(), 
      message: "Address is required" 
    }
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
    setFormData({ name: "", numberOfApartments: "", notes: "", totalSurface: "", address: "", image: null });
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

  // Added logic to reset errors when the modal is closed
  const handleCloseModal = () => {
    closeModal();
    setErrors({
      name: "",
      numberOfApartments: "",
      totalSurface: "",
      address: "",
      image: "",
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
        onClose={handleCloseModal} // Use the new handler to reset errors
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form onSubmit={(e) => e.preventDefault()}>          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
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
                title="Validation Error"
                message="Please correct the errors in the form below."
                variant="error"
                showLink={false}
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1">              <Label>Nom <span className="text-red-500">*</span></Label>
              <Input
                name="name"
                type="text"
                placeholder="Project Name"
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="col-span-1">
              <Label> Nombre total de propriétés <span className="text-red-500">*</span></Label>
              <Input
                name="numberOfApartments"
                type="number"
                placeholder="e.g. 10"
                onChange={handleChange}
              />
              {errors.numberOfApartments && (
                <p className="text-sm text-red-500">
                  {errors.numberOfApartments}
                </p>
              )}
            </div>

            <div className="col-span-1">              <Label>Surface totale  <span className="text-red-500">*</span></Label>
              <Input
                name="totalSurface"
                type="number"
                placeholder="e.g. 1000 m²"
                onChange={handleChange}
              />
              {errors.totalSurface && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.totalSurface}
                </p>
              )}
            </div>

            <div className="col-span-1">              <Label>Address <span className="text-red-500">*</span></Label>
              <Input
                name="address"
                type="text"
                placeholder="e.g. 123 Main St"
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
                name="image"
                onChange={handleFileChange} // Use the specialized handler
              />
              {formData.image && (
                <p className="mt-1 text-xs text-green-600">
                  File selected: {formData.image.name}
                </p>
              )}
              {errors.image && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.image}
                </p>
              )}
            </div>
            <div className="col-span-1 sm:col-span-2">
              <Label>Notes</Label>
              <TextArea
                value={formData.notes}
                name="notes"
                placeholder="Type your notes here..."
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