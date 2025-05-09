"use client";
import React, { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import Select from "../../form/Select";
import EmailContent from "@/components/email/EmailInbox/EmailContent";
import { stat } from "fs";
import { Notebook } from "lucide-react";
import addClient from "@/app/(admin)/clients/addClient";

interface AddProjectModalProps {
  onClientAdded?: () => void; // Callback to refresh client list
}

export default function AddClientModal({ onClientAdded }: AddProjectModalProps) {
  const { isOpen, openModal, closeModal } = useModal();

  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    status  : "",
    notes : "",
    provenance : "",
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

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    await addClient(formDataToSend);
    if (onClientAdded) {
      onClientAdded(); // Call the refresh callback to update the client list
    }
    // console.log("Saving project with data:", formData);
    // closeModal();
    console.log("Saving project with data:", formData);
    closeModal();
  };

  const [options, setOptions] = useState([
  ]);

  const status = [
    { value: "CLIENT", label: "Client" },
    { value: "LEAD", label: "Lead" },
  ]


  // useEffect(() => {
  //   const fetchProperties = async () => {
  //     try {
  //       const response = await getProperties();
  //       // Assuming response is an array of properties
  //       const formattedOptions = response.map((property: any) => ({
  //         value: property.id,
  //         label: property.name,
  //       }));
  //       setOptions(formattedOptions);
  //       console.log("Formatted options:", formattedOptions);
  //     } catch (error) {
  //       console.error("Error fetching properties:", error);
  //     }
  //   };

  //   fetchProperties();
  // }
  // , []);
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
        Add Client
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
                placeholder="e.g. John Doe"
                onChange={handleChange}
              />
            </div>

            <div className="col-span-1">
              <Label>Email</Label>
              <Input
                name="email"
                type="text"
                placeholder="e.g. john.doe@example.com"
                onChange={handleChange}
              />
            </div>

            <div className="col-span-1">
              <Label>Phone Number</Label>
              <Input
                name="phoneNumber"
                type="text"
                placeholder="e.g. 123-456-7890"
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
              <Label>Provenance</Label>
              <Input
                name="provenance"
                type="text"
                placeholder="Provenance"
                onChange={handleChange}
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