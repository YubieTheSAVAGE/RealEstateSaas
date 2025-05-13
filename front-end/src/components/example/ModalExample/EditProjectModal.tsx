"use client";
import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import { API_URL } from "@/app/common/constants/api";
import addProject from "@/app/(admin)/projects/addProjects";
import TextArea from "@/components/form/input/TextArea";
import FileInput from "@/components/form/input/FileInput";
import Alert from "@/components/ui/alert/Alert";
import { PencilIcon } from "@/icons";

interface EditProjectModalProps {
  onProjectAdded?: () => void; // Callback to refresh project list
  ProjectData?: any; // Add the type for ProjectData if available
}

export default function EditProjectModal({ onProjectAdded, ProjectData }: EditProjectModalProps) {
  const { isOpen, openModal, closeModal } = useModal();

  console.log("ProjectData", ProjectData);

  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    numberOfApartments: "",
    note: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    numberOfApartments: "",
  });

  // Update form field values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when the user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSave = async () => {
    // Validation for numberOfApartments
    if (
      !formData.numberOfApartments ||
      isNaN(Number(formData.numberOfApartments)) ||
      Number(formData.numberOfApartments) <= 0
    ) {
      setErrors((prev) => ({
        ...prev,
        numberOfApartments: "Number of properties is required and must be a positive integer",
      }));
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("numberOfApartments", formData.numberOfApartments);
    formDataToSend.append("note", formData.note);
    
    try {
      await addProject(formDataToSend);
      console.log("Saving project with data:", formData);
      
      // Reset form data
      setFormData({
        name: "",
        numberOfApartments: "",
        note: "",
      });
      
      // Call the refresh callback to update the project list
      if (onProjectAdded) {
        onProjectAdded();
      }
      
      closeModal();
    } catch (error) {
      console.error("Error adding project:", error);
      // You could add error handling UI here if needed
    }
  };

  const handleTextareaChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      note: value,
    }));
  };

  return (
    <>
      <PencilIcon onClick={openModal} />
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <h4 className="mb-2 text-lg font-medium text-gray-800 dark:text-white/90">
            Project Information
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Edit in the project details below.
          </p>
          {/* // gad hadi a chaka w khdem 3la l error ytjm3 f var wa7d
          // replace with the correct error handling
          // copier coller hadchy w diru f ga3 l modals */}
          {errors.numberOfApartments && (
            <div className="mb-4">
              <Alert 
                title="Error"
                message={errors.numberOfApartments}
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
                <p className="text-sm text-red-500">
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
            </div>

            <div className="col-span-1">
              <Label>Address <span className="text-red-500">*</span></Label>
              <Input
                defaultValue={ProjectData?.address}
                name="Address"
                type="text"
                placeholder="e.g. 123 Main St"
                onChange={handleChange}
              />
              {errors.numberOfApartments && (
                <p className="text-sm text-red-500">
                  {errors.numberOfApartments}
                </p>
              )}
            </div>
            <div className="col-span-1 sm:col-span-2">
              <Label>Plan</Label>
              <FileInput
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <Label>Note</Label>
              <TextArea
                defaultValue={ProjectData?.note}
                value={formData.note}
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