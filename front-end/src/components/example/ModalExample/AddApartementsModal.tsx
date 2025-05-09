"use client";
import React, { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import { API_URL } from "@/app/common/constants/api";
import addApartments from "@/app/(admin)/properties/addApartments";
import getProperties from "@/components/tables/DataTables/Projects/getProperties";
import Select from "../../form/Select";

interface AddProjectModalProps {
  onApartementsAdded?: () => void; // Callback to refresh project list
}

export default function AddProjectModal({ onApartementsAdded }: AddProjectModalProps) {
  const { isOpen, openModal, closeModal } = useModal();

  // State for form fields
  const [formData, setFormData] = useState({
    floor: "",
    number: "",
    type: "",
    area: "",
    threeDViewUrl: "",
    price: "",
    status: "",
    notes: "",
    pricePerM2 : "",
    zone : "",
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
      formDataToSend.append(key, value);
    });
    await addApartments(formDataToSend);
    // console.log("Saving project with data:", formData);
    // closeModal();
    console.log("Saving project with data:", formData);
    if (onApartementsAdded) {
      onApartementsAdded(); // Call the refresh callback to update the project list
    }
    closeModal();
  };

  const [options, setOptions] = useState([
  ]);

  const type = [
    { value: "APARTMENT", label: "Apartement" },
    { value: "DUPLEX", label: "Duplax" },
    { value: "VILLA", label: "Villa" },
  ]

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

  return (
    <>
      <Button size="sm" onClick={openModal}>
        Add Property
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
              <Label>Project Id</Label>
              <Select
                name="id"
                options={options}
                placeholder="Select Option"
                onChange={(value, name) => handleSelectChange(value, name)}
                className="dark:bg-dark-900"
              />
            </div>

            <div className="col-span-1">
              <Label>Floor</Label>
              <Input
                name="floor"
                type="number"
                placeholder="e.g. 10"
                onChange={handleChange}
              />
            </div>

            <div className="col-span-1">
              <Label>Number</Label>
              <Input
                name="number"
                type="number"
                placeholder="e.g. 10"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <Label>Zone</Label>
              <Input
                name="zone"
                type="text"
                placeholder="e.g. Zone 1"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <Label>Price Per M²</Label>
              <Input
                name="pricePerM2"
                type="number"
                placeholder="e.g. 10"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <Label>Type</Label>
              <Select
                name="type"
                options={type}
                placeholder="Type"
                onChange={(value, name) => handleSelectChange(value, name)}
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <Label>Area</Label>
              <Input
                name="area"
                type="number"
                placeholder="e.g. 10"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <Label>3D Link</Label>
              <Input
                name="threeDViewUrl"
                type="text"
                placeholder="e.g. 10"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <Label>Price</Label>
              <Input
                name="price"
                type="number"
                placeholder="e.g. 10"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <Label>Status</Label>
              <Select
                options={status}
                name="status"
                placeholder=""
                onChange={(value, name) => handleSelectChange(value, name)}
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <Label>Notes</Label>
              <Input
                name="notes"
                type="text"
                placeholder="Notes"
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