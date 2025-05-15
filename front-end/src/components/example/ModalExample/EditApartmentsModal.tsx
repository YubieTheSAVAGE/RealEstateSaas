"use client";
import React, { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import { API_URL } from "@/app/common/constants/api";
import editApartements from "@/app/(admin)/properties/editApartements";
import getProperties from "@/components/tables/DataTables/Projects/getProperties";
import Select from "../../form/Select";
import TextArea from "@/components/form/input/TextArea";
import FileInput from "@/components/form/input/FileInput";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import { FaPen } from "react-icons/fa";
import { PencilIcon } from "@/icons";

interface EditPropertyModalProps {
  // onApartementsAdded?: () => void; // Callback to refresh project list
  PropertyData ?: any; // Add the type for PropertyData if available

}

export default function EditPropertyModal({ PropertyData }: EditPropertyModalProps) {
  const { isOpen, openModal, closeModal } = useModal();

    const type = [
    { value: "APARTMENT", label: "Apartement" },
    { value: "DUPLEX", label: "Duplax" },
    { value: "VILLA", label: "Villa" },
    { value: "STORE", label: "Shop" },
    { value: "LAND", label: "Land" },
  ]

  // State for form fields
  const [formData, setFormData] = useState({
    id: PropertyData?.id || "",
    floor: PropertyData?.floor || "",
    number: PropertyData?.number || "",
    type: type.find(t => t.label === PropertyData?.type)?.value || "",    
    area: PropertyData?.area || 0,
    threeDViewUrl: PropertyData?.threeDViewUrl || "",
    price: PropertyData?.price || 0,
    status: PropertyData?.status || "AVAILABLE",
    notes: PropertyData?.notes || "",
    pricePerM2 : PropertyData?.pricePerM2 || 0,
    image: null as File | null, // Store as File object instead of string
    zone : PropertyData?.zone || "",
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
    // if (
    //   !formData.numberOfApartments ||
    //   isNaN(Number(formData.numberOfApartments)) ||
    //   Number(formData.numberOfApartments) <= 0
    // ) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     numberOfApartments: "Number of properties is required and must be a positive integer",
    //   }));
    //   return;
    // }

    // const formDataToSend = new FormData();
    // formDataToSend.append("name", formData.name);
    // formDataToSend.append("numberOfApartments", formData.numberOfApartments);
    // formDataToSend.append("note", formData.note);
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, String(value));
        }
      }
    });
    await editApartements(formDataToSend);
    // console.log("Saving project with data:", formData);
    // closeModal();
    console.log("Saving project with data:", formData);
    // if (onApartementsAdded) {
    //   onApartementsAdded(); // Call the refresh callback to update the project list
    // }
    closeModal();
  };

  const [options, setOptions] = useState([
  ]);



  const status = [
    { value: "AVAILABLE", label: "Available" },
    { value: "RESERVED", label: "Reserved" },
    { value: "SOLD", label: "Sold" },
  ]


  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();
        // Assuming response is an array of properties
        const formattedOptions = response.map((property: any) => ({
          value: property.id,
          label: property.name,
        }));
        setOptions(formattedOptions);
        console.log("Formatted options:", formattedOptions);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }
  , []);
  const handleSelectChange = (selectedValue: string, name:string) => {
    console.log("Selected value:", selectedValue, name);
    setFormData((prev) => ({
      ...prev,
      [name]: selectedValue, // Adjust the key based on the field being updated
    }));
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file) return;
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  function handleTextAreaChange(value: string): void {
    setFormData((prev) => ({
      ...prev,
      notes: value,
    }));
  }

  return (
    <>
      <span className="text-gray-500 hover:text-warning-400 dark:text-gray-400 dark:hover:text-warning-400 cursor-pointer">
        <PencilIcon onClick={openModal} />
      </span>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Property Information
          </h4>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1">
              <Label>Project <span className="text-red-500">*</span></Label>
              <Select
                defaultValue={PropertyData?.id}
                name="id"
                options={options}
                placeholder="Select Option"
                onChange={(value, name) => handleSelectChange(value, name)}
                className="dark:bg-dark-900"
              />
            </div>
            <div className="col-span-1">
              <Label>Type <span className="text-red-500">*</span></Label>
              <Select
                defaultValue={PropertyData?.type}
                name="type"
                options={type}
                placeholder="Type"
                onChange={(value, name) => handleSelectChange(value, name)}
              />
            </div>

            <div className="col-span-1">
              <Label>Floor <span className="text-red-500">*</span></Label>
              <Input
                defaultValue={PropertyData?.floor}
                name="floor"
                type="number"
                placeholder="e.g. 10"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <Label>Number <span className="text-red-500">*</span></Label>
              <Input
                defaultValue={PropertyData?.number}
                name="number"
                type="number"
                placeholder="e.g. 10"
                onChange={handleChange}
              />
            </div>

            <div className="col-span-1">
              <Label>Area <span className="text-red-500">*</span></Label>
              <Input
                defaultValue={PropertyData?.area}
                name="area"
                type="number"
                placeholder="e.g. 10"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <Label>Price Per M² <span className="text-red-500">*</span></Label>
              <Input
                defaultValue={PropertyData?.pricePerM2}
                name="pricePerM2"
                type="number"
                placeholder="e.g. 10"
                onChange={handleChange}
              />
            </div>

            <div className="col-span-1">
              <Label>Zone <span className="text-red-500">*</span></Label>
              <Input
                defaultValue={PropertyData?.zone}
                name="zone"
                type="text"
                placeholder="e.g. Zone 1"
                onChange={handleChange}
              />
            </div>
            
            <div className="col-span-1">
              <Label>3D Link</Label>
              <Input
                defaultValue={PropertyData?.threeDViewUrl}
                name="threeDViewUrl"
                type="text"
                placeholder="e.g. 10"
                onChange={handleChange}
              />
            </div>

            <div className="col-span-1">
              <Label>Total Price <span className="text-red-500">*</span></Label>
              <Input
                defaultValue={PropertyData?.price}
                name="price"
                type="number"
                placeholder="e.g. 10"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <Label>Status <span className="text-red-500">*</span></Label>
              <Select
                defaultValue={PropertyData?.status}
                options={status}
                name="status"
                placeholder=""
                onChange={(value, name) => handleSelectChange(value, name)}
              />
            </div>

            <div className="col-span-2">
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
            </div>

            <div className="col-span-1 sm:col-span-2">
              <Label>Notes</Label>
              <TextArea
                value={PropertyData.notes}
                rows={3}
                placeholder="Add notes here"
                onChange={handleTextAreaChange}
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