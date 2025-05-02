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

export default function AddProjectModal() {
  const { isOpen, openModal, closeModal } = useModal();

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
    addProject(formDataToSend);
    console.log("Saving project with data:", formData);
    closeModal();
  };

  return (
    <>
      <Button size="sm" onClick={openModal}>
        Add Project
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Project Information
          </h4>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1">
              <Label>Name</Label>
              <Input
                name="name"
                type="text"
                placeholder="Project Name"
                onChange={handleChange}
              />
            </div>

            <div className="col-span-1">
              <Label>Number of properties</Label>
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

            <div className="col-span-1 sm:col-span-2">
              <Label>Note</Label>
              <Input
                name="note"
                type="text"
                placeholder="Additional notes"
                onChange={handleChange}
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