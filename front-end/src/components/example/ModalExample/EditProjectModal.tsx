"use client";
import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import { API_URL } from "@/app/common/constants/api";
import editProject from "@/app/(admin)/projects/editProjects";
import TextArea from "@/components/form/input/TextArea";
import FileInput from "@/components/form/input/FileInput";
import Alert from "@/components/ui/alert/Alert";
import { PencilIcon } from "@/icons";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

interface EditProjectModalProps {
  ProjectData?: any; // Add the type for ProjectData if available
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
      newErrors.name = "Project name is required";
      hasErrors = true;
    }

    if (
      !formData.numberOfApartments ||
      isNaN(Number(formData.numberOfApartments)) ||
      Number(formData.numberOfApartments) <= 0
    ) {
      newErrors.numberOfApartments = "Number of properties is required and must be a positive integer";
      hasErrors = true;
    }

    if (
      !formData.totalSurface ||
      isNaN(Number(formData.totalSurface)) ||
      Number(formData.totalSurface) <= 0
    ) {
      newErrors.totalSurface = "Total surface is required and must be a positive number";
      hasErrors = true;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
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
      // Handle API errors here if needed
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
          Edit
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
            Project Information
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Edit the project details below.
          </p>

          {/* Validation Errors Summary */}
          {Object.values(errors).some((error) => error) && (
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
            <div className="col-span-1">
              <Label>Name <span className="text-red-500">*</span></Label>
              <Input
                defaultValue={ProjectData?.name}
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
              <Label>Total properties <span className="text-red-500">*</span></Label>
              <Input
                defaultValue={ProjectData?.numberOfApartments}
                name="numberOfApartments"
                type="number"
                placeholder="e.g. 10"
                onChange={handleChange}
              />
              {errors.numberOfApartments && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.numberOfApartments}
                </p>
              )}
            </div>

            <div className="col-span-1">
              <Label>Total surface <span className="text-red-500">*</span></Label>
              <Input
                defaultValue={ProjectData?.totalSurface}
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

            <div className="col-span-1">
              <Label>Address <span className="text-red-500">*</span></Label>
              <Input
                defaultValue={ProjectData?.address}
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
                onChange={handleFileChange}
              />
              {formData.image && (
                <p className="text-sm text-green-500 mt-1">
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
              <Label>Note</Label>
              <TextArea
                value={formData.notes}
                name="notes"
                placeholder="Type a note here..."
                rows={6}
                onChange={handleTextareaChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}