"use client";
import React, { useState, useEffect, useRef } from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import addApartments from "@/app/(admin)/properties/addApartments";
import getProperties from "@/components/tables/DataTables/Projects/getProperties";
import Select from "../../form/Select";
import TextArea from "@/components/form/input/TextArea";
import FileInput from "@/components/form/input/FileInput";
import getClient from "@/components/tables/DataTables/Clients/getClient";
import { Client } from "@/types/client";
// import { Property } from "@/types/property";
import { Project } from "@/types/project";

interface AddPropertyModalProps {
  onApartementsAdded?: () => void; // Callback to refresh project list
}

export default function AddPropertyModal({ onApartementsAdded }: AddPropertyModalProps) {
  const { isOpen, openModal, closeModal } = useModal();

  // Move clientOptions state before it's used
  const [clientOptions, setClientOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [filteredClients, setFilteredClients] = useState<Array<{ value: string; label: string }>>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const clientSearchRef = useRef<HTMLDivElement>(null);

  // State for form fields
  const [formData, setFormData] = useState({
    floor: "",
    number: "",
    type: "",
    area: "",
    threeDViewUrl: "",
    price: "",
    status: "AVAILABLE",
    notes: "",
    pricePerM2: "",
    image: null as File | null, // Store as File object instead of string
    zone: "",
    clientId: "",
  });

  // State for validation errors
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
    clientId: "",
  });

  // Add click outside handler for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (clientSearchRef.current && !clientSearchRef.current.contains(event.target as Node)) {
        setShowClientDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update filtered clients when search changes
  useEffect(() => {
    if (clientSearch.trim() === "") {
      setFilteredClients(clientOptions);
    } else {
      const filtered = clientOptions.filter(client =>
        client.label.toLowerCase().includes(clientSearch.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [clientSearch, clientOptions]);

  const handleClientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientSearch(e.target.value);
    setShowClientDropdown(true);
  };

  const handleClientSelect = (client: { value: string; label: string }) => {
    setFormData(prev => ({
      ...prev,
      clientId: client.value
    }));
    setClientSearch(client.label);
    setShowClientDropdown(false);
    setErrors(prev => ({
      ...prev,
      clientId: ""
    }));
  };

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

  const [options, setOptions] = useState([
  ]);

  const type = [
    { value: "APARTMENT", label: "Appartement" },
    { value: "DUPLEX", label: "Duplex" },
    { value: "VILLA", label: "Villa" },
    { value: "STORE", label: "Magasin" },
    { value: "LAND", label: "Terrain" },
  ]

  const status = [
    { value: "AVAILABLE", label: "Disponible" },
    { value: "RESERVED", label: "Réservé" },
    { value: "SOLD", label: "Vendu" },
  ]

  const fetchClients = async () => {
    const clients = await getClient();
    const formattedOptions = clients.map((client: Client) => ({
      value: client.id,
      label: client.name,
    }));
    setClientOptions(formattedOptions);
  }

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();
        // Assuming response is an array of properties
        const formattedOptions = response.map((property: Project) => ({
          value: property.id,
          label: property.name || `Property ${property.id}`,
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
  const handleSelectChange = (selectedValue: string, name: string) => {
    if (name == "status" && (selectedValue == "SOLD" || selectedValue == "RESERVED")) {
      fetchClients();
    }
    setFormData((prev) => ({
      ...prev,
      [name]: selectedValue, // Adjust the key based on the field being updated
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "", // Clear error for the selected field
    }));
  }
  const handleCloseModal = () => {
    setFormData({
      floor: "",
      number: "",
      type: "",
      area: "",
      threeDViewUrl: "",
      price: "",
      status: "AVAILABLE",
      notes: "",
      pricePerM2: "",
      image: null,
      zone: "",
      clientId: "",
    });
    setErrors({
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
      clientId: "",
    });
    closeModal();
  }
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

  // Added a function to handle validation errors dynamically
  const validateForm = () => {
    const newErrors = { ...errors };
    let hasErrors = false;

    const validations = [
      { field: "id", test: (v: string) => !v, message: "Le projet est requis" },
      { field: "number", test: (v: string) => !v, message: "Le numéro est requis" },
      { field: "type", test: (v: string) => !v, message: "Le type est requis" },
      { field: "area", test: (v: string) => !v || isNaN(Number(v)) || Number(v) <= 0, message: "La superficie doit être un nombre positif" },
      { field: "price", test: (v: string) => !v || isNaN(Number(v)) || Number(v) <= 0, message: "Le prix doit être un nombre positif" },
      { field: "status", test: (v: string) => !v, message: "Le statut est requis" },
      { field: "floor", test: (v: string) => !v || isNaN(Number(v)) || Number(v) < 0, message: "L'étage doit être un nombre positif" },
      { field: "zone", test: (v: string) => !v, message: "La zone est requise" },
      { field: "pricePerM2", test: (v: string) => !v || isNaN(Number(v)) || Number(v) <= 0, message: "Le prix par m² doit être un nombre positif" }
    ];

    validations.forEach(({ field, test, message }) => {
      if (test(formData[field as keyof typeof formData] as string)) {
        newErrors[field as keyof typeof errors] = message;
        hasErrors = true;
      } else {
        newErrors[field as keyof typeof errors] = ""; // Clear previous error if validation passes
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

    await addApartments(formDataToSend);
    // console.log("Saving project with data:", formData);
    // handleCloseModal();
    console.log("Saving project with data:", formData);
    if (onApartementsAdded) {
      onApartementsAdded(); // Call the refresh callback to update the project list
    }
    handleCloseModal();
  };

  return (
    <>
      <Button size="sm" onClick={openModal}>
        Ajouter un bien
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        className="max-w-[584px] p-5 lg:p-10 m-4"
      >
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Informations du bien
        </h4>
        
        <div className="custom-scrollbar max-h-[70vh] overflow-y-auto px-1">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <div className="col-span-1">
                <Label>Projet <span className="text-red-500">*</span></Label>
                <Select
                  name="id"
                  options={options}
                  placeholder="Sélectionner une option"
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
                  name="type"
                  options={type}
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
                <Label>Étage <span className="text-red-500">*</span></Label>
                <Input
                  name="floor"
                  type="number"
                  placeholder="ex: 10"
                  onChange={handleChange}
                />
                {errors.floor && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.floor}
                  </p>
                )}

              </div>
              <div className="col-span-1">
                <Label>Numéro <span className="text-red-500">*</span></Label>
                <Input
                  name="number"
                  type="text"
                  placeholder="ex: 10A"
                  onChange={handleChange}
                />
                {errors.number && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.number}
                  </p>
                )}
              </div>

              <div className="col-span-1">
                <Label>Superficie <span className="text-red-500">*</span></Label>
                <Input
                  name="area"
                  type="number"
                  placeholder="ex: 10"
                  onChange={handleChange}
                />
                {errors.area && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.area}
                  </p>
                )}
              </div>
              <div className="col-span-1">
                <Label>Prix/m² <span className="text-red-500">*</span></Label>
                <Input
                  name="pricePerM2"
                  type="number"
                  placeholder="ex: 10"
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
                  name="zone"
                  type="text"
                  placeholder="ex: Zone 1"
                  onChange={handleChange}
                />
                {errors.zone && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.zone}
                  </p>
                )}
              </div>

              <div className="col-span-1">
                <Label>Lien 3D</Label>
                <Input
                  name="threeDViewUrl"
                  type="text"
                  placeholder="ex: 10"
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-1">
                <Label>Prix total <span className="text-red-500">*</span></Label>
                <Input
                  name="price"
                  type="number"
                  placeholder="ex: 10"
                  onChange={handleChange}
                />
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.price}
                  </p>
                )}
              </div>
              <div className="col-span-1">
                <Label>Statut <span className="text-red-500">*</span></Label>
                <Select
                  defaultValue={status[0].value}
                  options={status}
                  name="status"
                  placeholder=""
                  onChange={(value, name) => handleSelectChange(value, name)}
                />
              </div>
              {(formData.status === "SOLD" || formData.status === "RESERVED") && (
                <div className="col-span-1" ref={clientSearchRef}>
                  <Label>Client <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <div onClick={() => setShowClientDropdown(true)}>
                      <Input
                        name="clientSearch"
                        type="text"
                        defaultValue={clientSearch}
                        onChange={handleClientSearch}
                        placeholder="Rechercher un client..."
                        className="w-full"
                      />
                    </div>
                    {showClientDropdown && filteredClients.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto dark:bg-dark-900 dark:border-dark-700">
                        {filteredClients.map((client) => (
                          <div
                            key={client.value}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-800"
                            onClick={() => handleClientSelect(client)}
                          >
                            {client.label}
                          </div>
                        ))}
                      </div>
                    )}
                    {showClientDropdown && filteredClients.length === 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-dark-900 dark:border-dark-700">
                        <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                          Aucun client trouvé
                        </div>
                      </div>
                    )}
                  </div>
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
                    Fichier sélectionné : {formData.image.name}
                  </p>
                )}
              </div>

              <div className="col-span-1 sm:col-span-2">
                <Label>Notes</Label>
                <TextArea
                  value={formData.notes}
                  rows={3}
                  placeholder="Ajouter des notes ici"
                  onChange={handleTextAreaChange}
                />
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <Button size="sm" variant="outline" onClick={handleCloseModal}>
            Fermer
          </Button>
          <Button size="sm" onClick={handleSave}>
            Enregistrer
          </Button>
        </div>
      </Modal>
    </>
  );
}