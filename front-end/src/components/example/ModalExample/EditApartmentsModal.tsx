"use client";
import React, { useState, useEffect } from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import editApartements from "@/app/(admin)/properties/editApartements";
import getProperties from "@/components/tables/DataTables/Projects/getProperties";
import Select from "../../form/Select";
import TextArea from "@/components/form/input/TextArea";
import FileInput from "@/components/form/input/FileInput";
import { PencilIcon } from "@/icons";
import getClient from "@/components/tables/DataTables/Clients/getClient";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { Property } from "@/types/property";

interface EditPropertyModalProps {
  // onApartementsAdded?: () => void; // Callback to refresh project list
  PropertyData ?: Property; // Add the type for PropertyData if available
  onRefresh?: () => void; // Callback to refresh project list after editing
  details?: boolean;
}

export default function EditPropertyModal({ PropertyData, onRefresh, details }: EditPropertyModalProps) {
  const { isOpen, openModal, closeModal } = useModal();

  const type = {
    "APARTMENT": "Apartment",
    'DUPLEX': "Duplex",
    'VILLA': "Villa",
    'STORE': "Store",
    'LAND': "Land",
  }
  const typeOptions = Object.entries(type).map(([value, label]) => ({
    value,
    label,
  }));

  const [clientOptions, setClientOptions] = useState([]);
  const fetchClients = async () => {
    try {
      const response = await getClient();
      // Assuming response is an array of properties
      const formattedOptions = response.map((property: Property) => ({
        value: property.id,
        label: property.project.name,
      }));
      setClientOptions(formattedOptions);
      console.log("Formatted options:", formattedOptions);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      if (PropertyData?.status === "SOLD") {
        await fetchClients();
        console.log("PropertyData.status", PropertyData.status);
        console.log("PropertyData", PropertyData);
        console.log("clientOptions", clientOptions);
        console.log("clientOptions2", PropertyData.client?.id);
      }
    };
    fetchData();
  }, [PropertyData?.status]);

    const [errors, setErrors] = useState({
      id: "",
      floor: "",
      number: "",
      type: "",
      area: "",
      price: "",
      status: "",
      pricePerM2: "",
      zone: "",
      image: "",
      clientId : "",
    });
  // State for form fields
  interface FormDataState {
    id: number | string; // Changed to number | string to handle both cases
    floor: number;
    number: number;
    type: string;
    area: number;
    threeDViewUrl: string;
    price: number;
    status: string;
    notes: string;
    pricePerM2: number;
    image: File | null;
    zone: string;
    clientId: string; // Changed to string to handle client ID
  }

  const [formData, setFormData] = useState<FormDataState>({
    id: PropertyData?.id || 0,
    floor: PropertyData?.floor || 0,
    number: PropertyData?.number || 0,
    type:  PropertyData?.type || "",    
    area: PropertyData?.area || 0,
    threeDViewUrl: PropertyData?.threeDViewUrl || "",
    price: PropertyData?.price || 0,
    status: PropertyData?.status || "AVAILABLE",
    notes: PropertyData?.notes || "",
    pricePerM2: PropertyData?.pricePerM2 || 0,
    image: null, // Default to null for image
    zone: PropertyData?.zone || "",
    clientId: PropertyData?.client?.id ? String(PropertyData.client.id) : "", // Ensure clientId is always a string
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

  // Added a function to handle validation errors dynamically
  const validateForm = () => {
    const newErrors = { ...errors };
    let hasErrors = false;

    const validations = [
      { field: "id", test: (v : string) => !v, message: "Project is required" },
      { field: "number", test: (v: string) => !v, message: "Number is required" },
      { field: "type", test: (v: string) => !v, message: "Type is required" },
      { field: "area", test: (v: string) => !v || isNaN(Number(v)) || Number(v) <= 0, message: "Area must be a positive number or required" },
      { field: "price", test: (v: string) => !v || isNaN(Number(v)) || Number(v) <= 0, message: "Price must be a positive number or required" },
      { field: "status", test: (v: string) => !v, message: "Status is required" },
      { field: "floor", test: (v: string) => !v || isNaN(Number(v)) || Number(v) < 0, message: "Floor must be a positive number or required" },
      { field: "zone", test: (v: string) => !v, message: "Zone is required" },
      { field: "pricePerM2", test: (v: string) => !v || isNaN(Number(v)) || Number(v) <= 0, message: "Price per M² must be a positive number or required" },
    ];

    validations.forEach(({ field, test, message }) => {
      if (test(formData[field as keyof typeof formData] as string)) {
        newErrors[field as keyof typeof newErrors] = message;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return hasErrors;
  };



  const handleSave = async () => {
    if (validateForm()) return; // Stop execution if there are validation errors

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

    try {
      console.log("Form data to send:", formDataToSend);
      await editApartements(formDataToSend);
      if (onRefresh) {
        onRefresh();
      }
      closeModal();
    } catch (error) {
      console.error("Error saving project:", error);
    }
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
        const formattedOptions = response.map((property: Property) => ({
          value: property.id,
          label: property.project.name,
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
    // console.log("Selected value:", selectedValue, name);
    if (name === "status" && selectedValue === "SOLD") {
      fetchClients();
    }
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
      {details ? (
        <DropdownItem 
          className="text-gray-500 hover:text-warning-400 dark:text-gray-400 dark:hover:text-warning-400 cursor-pointer"
          onClick={openModal}
        >
          Edit
        </DropdownItem>
      ) : (
        <span className="text-gray-500 hover:text-warning-400 dark:text-gray-400 dark:hover:text-warning-400 cursor-pointer">
          <PencilIcon onClick={openModal} />
        </span>
      )}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <h4 className="mb-2 text-lg font-medium text-gray-800 dark:text-white/90">
            Edit Property
          </h4>
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Edit the property details below.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1">
              <Label>Project <span className="text-red-500">*</span></Label>
              <Select
                defaultValue={PropertyData?.id !== undefined ? String(PropertyData.id) : undefined}
                name="id"
                options={options}
                placeholder="Select Option"
                onChange={(value, name) => handleSelectChange(value, name)}
                className="dark:bg-dark-900"
              />
              {errors.id && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.id}
                </p>
              )}
            </div>
            <div className="col-span-1">
              <Label>Type <span className="text-red-500">*</span></Label>
              <Select
                defaultValue={PropertyData?.type}
                name="type"
                options={typeOptions}
                placeholder="Type"
                onChange={(value, name) => handleSelectChange(value, name)}
              />
              {errors.type && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.type}
                </p>
              )}
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
              {errors.floor && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.floor}
                </p>
              )}
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
              {errors.number && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.number}
                </p>
              )}
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
              {errors.area && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.area}
                </p>
              )}
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
              {errors.pricePerM2 && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.pricePerM2}
                </p>
              )}
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
              {errors.zone && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.zone}
                </p>
              )}
            </div>
            
            <div className="col-span-1">
              <Label>3D Link</Label>
              <Input
                defaultValue={PropertyData?.threeDViewUrl ?? undefined}
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
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.price}
                </p>
              )}
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
              {errors.status && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.status}
                </p>
              )}
            </div>
            {formData.status === "SOLD" && (
              <div className="col-span-1">
                <Label>Client <span className="text-red-500">*</span></Label>
                <Select
                  defaultValue={formData?.clientId || ""}
                  options={clientOptions}
                  name="clientId"
                  placeholder="Select Option"
                  onChange={(value, name) => handleSelectChange(value, name)}
                  className="dark:bg-dark-900"
                />
                {errors.clientId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.clientId}
                  </p>
                )}
              </div>
            )}


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
                value={PropertyData?.notes ?? ""}
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