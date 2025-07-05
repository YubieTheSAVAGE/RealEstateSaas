"use client";
import React, { useState, useEffect, useRef } from "react";
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
import { Project } from "@/types/project";
import { Client } from "@/types/client";
import Stepper from "../../ui/stepper/Stepper";
import Radio from "../../form/input/Radio";
import Checkbox from "../../form/input/Checkbox";

interface EditPropertyModalProps {
  // onApartementsAdded?: () => void; // Callback to refresh project list
  PropertyData?: Property; // Add the type for PropertyData if available
  onRefresh?: () => void; // Callback to refresh project list after editing
  details?: boolean;
}

export default function EditPropertyModal({ PropertyData, onRefresh, details }: EditPropertyModalProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const [clientOptions, setClientOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [filteredClients, setFilteredClients] = useState<Array<{ value: string; label: string }>>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const clientSearchRef = useRef<HTMLDivElement>(null);

  // Stepper state
  const [step, setStep] = useState(0);

  // New fields for annex surfaces, parking, and pricing
  const [surfaces, setSurfaces] = useState({
    habitable: PropertyData?.habitable?.toString() || "",
    balcon: PropertyData?.balcon?.toString() || "",
    terrasse: PropertyData?.terrasse?.toString() || "",
    piscine: PropertyData?.piscine?.toString() || "",
  });

  // New fields for Land and Store types
  const [landStoreFields, setLandStoreFields] = useState({
    totalArea: PropertyData?.totalArea?.toString() || "",
    mezzanineArea: PropertyData?.mezzanineArea?.toString() || "",
    mezzaninePrice: PropertyData?.mezzaninePrice?.toString() || "",
  });

  const [prixType, setPrixType] = useState(PropertyData?.prixType || "FIXE");
  const [prixM2, setPrixM2] = useState(PropertyData?.prixM2?.toString() || "");
  const [prixTotal, setPrixTotal] = useState(PropertyData?.prixTotal?.toString() || "");
  const [prixBalconPct, setPrixBalconPct] = useState(PropertyData?.prixBalconPct?.toString() || "50");
  const [prixTerrassePct, setPrixTerrassePct] = useState(PropertyData?.prixTerrassePct?.toString() || "30");
  const [prixPiscine, setPrixPiscine] = useState(PropertyData?.prixPiscine?.toString() || "");
  const [parkingDisponible, setParkingDisponible] = useState(PropertyData?.parkingDisponible || false);
  const [parkingInclus, setParkingInclus] = useState(PropertyData?.parkingInclus || false);
  const [prixParking, setPrixParking] = useState(PropertyData?.prixParking?.toString() || "");
  const [commissionPerM2, setCommissionPerM2] = useState(PropertyData?.commissionPerM2?.toString() || "");





  const typeOptions = [
    { value: "APARTMENT", label: "Appartement" },
    { value: "DUPLEX", label: "Duplex" },
    { value: "VILLA", label: "Villa" },
    { value: "STORE", label: "Magasin" },
    { value: "LAND", label: "Terrain" },
  ]

  const fetchClients = async () => {
    const clients = await getClient();
    console.log("Fetched clients:", clients);
    const formattedOptions = clients.map((client: Client) => ({
      value: client.id,
      label: client.name,
    }));
    setClientOptions(formattedOptions);
    console.log("Formatted client options:", formattedOptions);
  }

// console.log("clientOptions", clientOptions);
  useEffect(() => {
    const fetchData = async () => {
      if (PropertyData?.status === "SOLD" || PropertyData?.status === "RESERVED") {
        await fetchClients();
        console.log("PropertyData.status", PropertyData.status);
        console.log("PropertyData", PropertyData);
        console.log("clientOptions", clientOptions);
        console.log("clientOptions2", PropertyData.client?.id);
      }
    };
    fetchData();
  }, [PropertyData?.status]);

  const handleClientSelect = (client: { value: string; label: string }) => {
    fetchClients();
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

  const [errors, setErrors] = useState({
    id: "",
    floor: "",
    number: "",
    type: "",
    status: "",
    zone: "",
    image: "",
    clientId: "",
    prixTotal: "",
    prixBalconPct: "",
    prixTerrassePct: "",
    prixPiscine: "",
    prixParking: "",
    habitable: "",
    balcon: "",
    terrasse: "",
    piscine: "",
    prixM2: "",
    totalArea: "",
    mezzanineArea: "",
    mezzaninePrice: "",
    commissionPerM2: "",
  });
  // State for form fields
  interface FormDataState {
    id: number | string; // Changed to number | string to handle both cases
    floor: number | string;
    number: number | string; // Changed to allow string values
    type: string;
    status: string;
    notes: string;
    image: File | null;
    zone: string;
    clientId: string; // Changed to string to handle client ID
    prixTotal: string;
  }

  const [formData, setFormData] = useState<FormDataState>({
    id: PropertyData?.id || 0,
    floor: PropertyData?.floor || 0,
    number: PropertyData?.number || "",
    type: PropertyData?.type || "",
    status: PropertyData?.status || "AVAILABLE",
    notes: PropertyData?.notes || "",
    image: null,
    zone: PropertyData?.zone || "",
    clientId: PropertyData?.client?.id ? String(PropertyData.client.id) : "",
    prixTotal: PropertyData?.prixTotal?.toString() || "",
  });

  // Helper functions
  const shouldShowStandardFields = () => {
    return ["APARTMENT", "DUPLEX", "VILLA"].includes(formData.type);
  };

  const needsFloorField = () => {
    return formData.type === "APARTMENT";
  };

  const isLandType = () => {
    return formData.type === "LAND";
  };

  const isStoreType = () => {
    return formData.type === "STORE";
  };

  // Calculation logic
  const calcSummary = React.useMemo(() => {
    const hab = Number(surfaces.habitable) || 0;
    const bal = Number(surfaces.balcon) || 0;
    const ter = Number(surfaces.terrasse) || 0;
    const pis = Number(surfaces.piscine) || 0;
    const totalArea = Number(landStoreFields.totalArea) || 0;
    const m2 = Number(prixM2) || 0;
    const balPct = Number(prixBalconPct) / 100;
    const terPct = Number(prixTerrassePct) / 100;
    const pisPrix = Number(prixPiscine) || 0;
    const parkPrix = Number(prixParking) || 0;
    const mezzaninePrix = Number(landStoreFields.mezzaninePrice) || 0;
    const commission = Number(commissionPerM2) || 0;
    let main = 0, balcon = 0, terrasse = 0, piscine = 0, parking = 0, mezzanine = 0, total = 0, commissionTotal = 0;
    
    if (prixType === "FIXE") {
      total = Number(prixTotal) || 0;
      main = total;
      
      // Calculate commission for fixed price
      if (commission > 0) {
        if (shouldShowStandardFields() || formData.type === "VILLA" || formData.type === "DUPLEX") {
          commissionTotal = commission * (hab + bal + ter + pis);
        } else {
          commissionTotal = commission * totalArea;
          if (isStoreType()) {
            commissionTotal += commission * (Number(landStoreFields.mezzanineArea) || 0);
          }
        }
        total += commissionTotal;
      }
    } else {
      if (shouldShowStandardFields() || formData.type === "VILLA" || formData.type === "DUPLEX") {
        main = hab * m2;
        balcon = bal * (m2 * balPct);
        terrasse = ter * (m2 * terPct);
        piscine = pis * pisPrix;
      } else {
        main = totalArea * m2;
        if (isStoreType()) {
          mezzanine = mezzaninePrix;
        }
      }
      parking = parkingDisponible && !parkingInclus ? parkPrix : 0;
      total = main + balcon + terrasse + piscine + parking + mezzanine;
      
      // Calculate commission for price per m²
      if (commission > 0) {
        if (shouldShowStandardFields() || formData.type === "VILLA" || formData.type === "DUPLEX") {
          commissionTotal = commission * (hab + bal + ter + pis);
        } else {
          commissionTotal = commission * totalArea;
          if (isStoreType()) {
            commissionTotal += commission * (Number(landStoreFields.mezzanineArea) || 0);
          }
        }
        total += commissionTotal;
      }
    }
    return { main, balcon, terrasse, piscine, parking, mezzanine, total, commissionTotal };
  }, [surfaces, landStoreFields, prixType, prixM2, prixTotal, prixBalconPct, prixTerrassePct, prixPiscine, parkingDisponible, parkingInclus, prixParking, formData.type, commissionPerM2]);

  // Helper function to validate percentage input
  const validatePercentage = (value: string, fieldName: string) => {
    const num = Number(value);
    if (value === "") return "";
    if (isNaN(num)) return `${fieldName} doit être un nombre valide`;
    if (num < 0) return `${fieldName} ne peut pas être négatif`;
    if (num > 100) return `${fieldName} ne peut pas dépasser 100%`;
    return "";
  };

  // Helper function to format price display
  const formatPrice = (price: number) => {
    if (isNaN(price) || price < 0) return "0 DH";
    return `${price.toLocaleString()} DH`;
  };

  // Calculate individual prices for display
  const balconPricePerM2 = React.useMemo(() => {
    const m2 = Number(prixM2) || 0;
    const pct = Number(prixBalconPct) || 0;
    return m2 * (pct / 100);
  }, [prixM2, prixBalconPct]);

  const terrassePricePerM2 = React.useMemo(() => {
    const m2 = Number(prixM2) || 0;
    const pct = Number(prixTerrassePct) || 0;
    return m2 * (pct / 100);
  }, [prixM2, prixTerrassePct]);

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
      { field: "id", test: (v: string) => !v, message: "Le projet est requis" },
      { field: "number", test: (v: string) => !v, message: "Le numéro est requis" },
      { field: "type", test: (v: string) => !v, message: "Le type est requis" },
      { field: "area", test: (v: string) => !v || isNaN(Number(v)) || Number(v) <= 0, message: "La superficie doit être un nombre positif ou est requise" },
      { field: "price", test: (v: string) => !v || isNaN(Number(v)) || Number(v) <= 0, message: "Le prix doit être un nombre positif ou est requis" },
      { field: "status", test: (v: string) => !v, message: "Le statut est requis" },
      { field: "floor", test: (v: string) => v === "" || v === undefined || v === null || isNaN(Number(v)) || Number(v) < 0, message: "L'étage est requis" },
      { field: "zone", test: (v: string) => !v, message: "La zone est requise" },
      { field: "pricePerM2", test: (v: string) => !v || isNaN(Number(v)) || Number(v) <= 0, message: "Le prix par m² doit être un nombre positif ou est requis" },
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

    // Add land/store specific fields if applicable
    if (isLandType() || isStoreType()) {
      formDataToSend.append('totalArea', landStoreFields.totalArea);
      if (isStoreType()) {
        formDataToSend.append('mezzanineArea', landStoreFields.mezzanineArea);
        formDataToSend.append('mezzaninePrice', landStoreFields.mezzaninePrice);
      }
    }

    // Add surfaces and pricing data for all property types
    formDataToSend.append('prixType', prixType);
    if (prixType === "FIXE") {
      formDataToSend.append('prixTotal', prixTotal);
    } else {
      formDataToSend.append('prixM2', prixM2);
      if (shouldShowStandardFields() || formData.type === "VILLA" || formData.type === "DUPLEX") {
        formDataToSend.append('prixBalconPct', prixBalconPct);
        formDataToSend.append('prixTerrassePct', prixTerrassePct);
        formDataToSend.append('prixPiscine', prixPiscine);
      }
    }
    
    // Add commission if provided
    if (commissionPerM2) {
      formDataToSend.append('commissionPerM2', commissionPerM2.toString());
    }
    
    if (shouldShowStandardFields() || formData.type === "VILLA" || formData.type === "DUPLEX") {
      Object.entries(surfaces).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });
    }
    
    if (parkingDisponible) {
      formDataToSend.append('parkingInclus', parkingInclus.toString());
      if (!parkingInclus) {
        formDataToSend.append('prixParking', prixParking);
      }
    }

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
    { value: "AVAILABLE", label: "Disponible" },
    { value: "RESERVED", label: "Réservé" },
    { value: "SOLD", label: "Vendu" },
  ]

  useEffect(() => {
    fetchClients();
  }, [clientSearch]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();
        // Assuming response is an array of properties
        const formattedOptions = response.map((property: Project) => ({
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

  const handleSelectChange = (selectedValue: string, name: string) => {
    // console.log("Selected value:", selectedValue, name);
    if (name === "status" && (selectedValue === "SOLD" || selectedValue === "RESERVED")) {
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

  const handleClientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setClientSearch(e.target.value);
      setShowClientDropdown(true);
    };

  // Helper function to validate non-negative number input (for floor, can be 0)
  const validateNonNegativeNumber = (value: string, fieldName: string) => {
    if (value === "") return "";
    const num = Number(value);
    if (isNaN(num)) return `${fieldName} doit être un nombre valide`;
    if (num < 0) return `${fieldName} ne peut pas être négatif`;
    return "";
  };

  // Helper function to validate positive number input
  const validatePositiveNumber = (value: string, fieldName: string) => {
    if (value === "") return "";
    const num = Number(value);
    if (isNaN(num)) return `${fieldName} doit être un nombre valide`;
    if (num < 0) return `${fieldName} ne peut pas être négatif`;
    if (num === 0) return `${fieldName} doit être supérieur à 0`;
    return "";
  };

  // Add a function to check if step 0 is valid based on property type
  const isStep0Valid = () => {
    const requiredFields = ['id', 'number', 'type', 'status'];
    
    // Add conditional required fields based on property type
    if (needsFloorField()) {
      requiredFields.push('floor');
    }
    if (shouldShowStandardFields() || formData.type === "VILLA" || formData.type === "DUPLEX") {
      requiredFields.push('zone');
    }
    
    // Check all required fields
    for (const field of requiredFields) {
      const value = formData[field as keyof typeof formData];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return false;
      }
    }
    
    // Check client field if required
    const clientRequired = formData.status === "SOLD" || formData.status === "RESERVED";
    if (clientRequired && (!formData.clientId || formData.clientId.trim() === '')) {
      return false;
    }
    
    return true;
  };

  // Add a function to handle step navigation
  const handleNextStep = () => {
    if (isStep0Valid()) {
      setStep(1);
    }
  };

  const handlePreviousStep = () => {
    setStep(0);
  };

  // Stepper steps
  const steps = [
    { label: "Informations de base" },
    { label: "Surfaces & Tarification" },
  ];

  return (
    <>
      {details ? (
        <DropdownItem
          className="text-gray-500 hover:text-warning-400 dark:text-gray-400 dark:hover:text-warning-400 cursor-pointer"
          onClick={openModal}
        >
          Modifier
        </DropdownItem>
      ) : (
        <span className="text-gray-500 hover:text-warning-400 dark:text-gray-400 dark:hover:text-warning-400 cursor-pointer"  onClick={openModal}>
          <PencilIcon />
        </span>
      )}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="w-full max-w-4xl mx-4 p-4 sm:p-6 lg:p-8"
      >
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold">Modifier la propriété</h1>
        </div>
        <Stepper steps={steps} currentStep={step} className="mb-4 sm:mb-6" />
        <div className="custom-scrollbar max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
          {step === 0 && (
            <form onSubmit={e => { e.preventDefault(); setStep(1); }}>
              <div className="grid grid-cols-1 gap-4 sm:gap-6 gap-y-4 sm:gap-y-5 sm:grid-cols-2">
              <div className="col-span-1">
                {/* Form labels */}
                <Label>Projet <span className="text-red-500">*</span></Label>
                <Select
                  defaultValue={PropertyData?.id !== undefined ? String(PropertyData.id) : undefined}
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
              <div className="col-span-2 sm:col-span-1">
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

              {/* Conditional fields based on property type */}
              {needsFloorField() && (
                <div className="col-span-2 sm:col-span-1">
                  <Label>Étage <span className="text-red-500">*</span></Label>
                  <Input 
                    name="floor" 
                    type="number" 
                    placeholder="ex: 10" 
                    value={formData.floor} 
                    onChange={e => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, floor: value }));
                      const error = validateNonNegativeNumber(value, "L'étage");
                      setErrors(prev => ({ ...prev, floor: error }));
                    }}
                    min="0"
                    step={0.01}
                  />
                  {errors.floor && <p className="text-sm text-red-500 mt-1">{errors.floor}</p>}
                </div>
              )}
              {(shouldShowStandardFields() || formData.type === "VILLA" || formData.type === "DUPLEX") && (
                <div className="col-span-2 sm:col-span-1">
                  <Label>Zone <span className="text-red-500">*</span></Label>
                  <Input name="zone" type="text" placeholder="ex: Zone 1" value={formData.zone} onChange={handleChange} />
                  {errors.zone && <p className="text-sm text-red-500 mt-1">{errors.zone}</p>}
                </div>
              )}
              <div className="col-span-2 sm:col-span-1">
                <Label>Numéro <span className="text-red-500">*</span></Label>
                <Input
                  name="number"
                  type="text"
                  placeholder="ex: 10A"
                  value={formData.number}
                  onChange={handleChange}
                />
                {errors.number && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.number}
                  </p>
                )}
              </div>

                <div className="col-span-2 sm:col-span-1">
                  <Label>Statut <span className="text-red-500">*</span></Label>
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
              {(formData.status === "SOLD" || formData.status === "RESERVED") && (
                <div className="col-span-2 sm:col-span-1" ref={clientSearchRef}>
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
                  onChange={handleFileChange}
                />
                {formData.image && (
                  <p className="mt-1 text-xs text-green-600">
                    Fichier sélectionné: {formData.image.name}
                  </p>
                )}
              </div>

              <div className="col-span-2 ">
                <Label>Notes</Label>
                <TextArea
                  value={formData.notes}
                  rows={3}
                  placeholder="Ajouter des notes ici"
                  onChange={handleTextAreaChange}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end w-full gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <Button size="sm" variant="outline" onClick={closeModal} className="w-full sm:w-auto">Fermer</Button>
              <Button 
                size="sm" 
                type="button" 
                onClick={handleNextStep}
                disabled={!isStep0Valid()}
                className={`w-full sm:w-auto ${!isStep0Valid() ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Suivant
              </Button>
            </div>
          </form>
          )}
          {step === 1 && (
            <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
              <div className="grid grid-cols-1 gap-4 sm:gap-6 gap-y-4 sm:gap-y-5 sm:grid-cols-2">
                {/* Conditional fields based on property type */}
                {(shouldShowStandardFields() || formData.type === "VILLA" || formData.type === "DUPLEX") ? (
                  <>
                    {/* Surfaces for Villa, Apartment, Duplex */}
                    <div className="col-span-2 sm:col-span-1">
                      <Label>Surface habitable (m²) <span className="text-red-500">*</span></Label>
                      <Input 
                        name="habitable" 
                        type="number" 
                        placeholder="ex: 100" 
                        value={surfaces.habitable} 
                        onChange={e => {
                          const value = e.target.value;
                          setSurfaces(s => ({ ...s, habitable: value }));
                          const error = validatePositiveNumber(value, "La surface habitable");
                          setErrors(prev => ({ ...prev, habitable: error }));
                        }}
                        min="0.01"
                        step={0.01}
                      />
                      {errors.habitable && <p className="text-sm text-red-500 mt-1">{errors.habitable}</p>}
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label>Surface balcon (m²)</Label>
                      <Input 
                        name="balcon" 
                        type="number" 
                        placeholder="ex: 10" 
                        value={surfaces.balcon} 
                        onChange={e => {
                          const value = e.target.value;
                          setSurfaces(s => ({ ...s, balcon: value }));
                          if (value !== "") {
                            const error = validateNonNegativeNumber(value, "La surface balcon");
                            setErrors(prev => ({ ...prev, balcon: error }));
                          } else {
                            setErrors(prev => ({ ...prev, balcon: "" }));
                          }
                        }}
                        min="0"
                        step={0.01}
                      />
                      {errors.balcon && <p className="text-sm text-red-500 mt-1">{errors.balcon}</p>}
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label>Surface terrasse (m²)</Label>
                      <Input 
                        name="terrasse" 
                        type="number" 
                        placeholder="ex: 10" 
                        value={surfaces.terrasse} 
                        onChange={e => {
                          const value = e.target.value;
                          setSurfaces(s => ({ ...s, terrasse: value }));
                          if (value !== "") {
                            const error = validateNonNegativeNumber(value, "La surface terrasse");
                            setErrors(prev => ({ ...prev, terrasse: error }));
                          } else {
                            setErrors(prev => ({ ...prev, terrasse: "" }));
                          }
                        }}
                        min="0"
                        step={0.01}
                      />
                      {errors.terrasse && <p className="text-sm text-red-500 mt-1">{errors.terrasse}</p>}
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label>Surface piscine (m²)</Label>
                      <Input 
                        name="piscine" 
                        type="number" 
                        placeholder="ex: 5" 
                        value={surfaces.piscine} 
                        onChange={e => {
                          const value = e.target.value;
                          setSurfaces(s => ({ ...s, piscine: value }));
                          if (value !== "") {
                            const error = validateNonNegativeNumber(value, "La surface piscine");
                            setErrors(prev => ({ ...prev, piscine: error }));
                          } else {
                            setErrors(prev => ({ ...prev, piscine: "" }));
                          }
                        }}
                        min="0"
                        step={0.01}
                      />
                      {errors.piscine && <p className="text-sm text-red-500 mt-1">{errors.piscine}</p>}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Fields for Land and Store types */}
                    <div className="col-span-2 sm:col-span-1">
                      <Label>Surface totale (m²) <span className="text-red-500">*</span></Label>
                      <Input 
                        name="totalArea" 
                        type="number" 
                        placeholder="ex: 500" 
                        value={landStoreFields.totalArea} 
                        onChange={e => {
                          const value = e.target.value;
                          setLandStoreFields(prev => ({ ...prev, totalArea: value }));
                          const error = validatePositiveNumber(value, "La surface totale");
                          setErrors(prev => ({ ...prev, totalArea: error }));
                        }}
                        min="0.01"
                        step={0.01}
                      />
                      {errors.totalArea && <p className="text-sm text-red-500 mt-1">{errors.totalArea}</p>}
                    </div>
                    
                    {isStoreType() && (
                      <>
                        <div className="col-span-2 sm:col-span-1">
                          <Label>Surface mezzanine (m²)</Label>
                          <Input 
                            name="mezzanineArea" 
                            type="number" 
                            placeholder="ex: 50" 
                            value={landStoreFields.mezzanineArea} 
                            onChange={e => {
                              const value = e.target.value;
                              setLandStoreFields(prev => ({ ...prev, mezzanineArea: value }));
                              if (value !== "") {
                                const error = validateNonNegativeNumber(value, "La surface mezzanine");
                                setErrors(prev => ({ ...prev, mezzanineArea: error }));
                              } else {
                                setErrors(prev => ({ ...prev, mezzanineArea: "" }));
                              }
                            }}
                            min="0"
                            step={0.01}
                          />
                          {errors.mezzanineArea && <p className="text-sm text-red-500 mt-1">{errors.mezzanineArea}</p>}
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <Label>Prix mezzanine (DH)</Label>
                          <Input 
                            name="mezzaninePrice" 
                            type="number" 
                            placeholder="ex: 100000" 
                            value={landStoreFields.mezzaninePrice} 
                            onChange={e => {
                              const value = e.target.value;
                              setLandStoreFields(prev => ({ ...prev, mezzaninePrice: value }));
                              if (value !== "") {
                                const error = validateNonNegativeNumber(value, "Le prix mezzanine");
                                setErrors(prev => ({ ...prev, mezzaninePrice: error }));
                              } else {
                                setErrors(prev => ({ ...prev, mezzaninePrice: "" }));
                              }
                            }}
                            min="0"
                            step={0.01}
                          />
                          {errors.mezzaninePrice && <p className="text-sm text-red-500 mt-1">{errors.mezzaninePrice}</p>}
                        </div>
                      </>
                    )}
                  </>
                )}
                
                {/* Pricing type for all property types */}
                <div className="col-span-2">
                  <Label>Type de prix <span className="text-red-500">*</span></Label>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-2">
                    <Radio id="prix-fixe" name="prixType" value="FIXE" checked={prixType === "FIXE"} label="Prix fixe" onChange={(value) => setPrixType(value as "FIXE" | "M2")} />
                    <Radio id="prix-m2" name="prixType" value="M2" checked={prixType === "M2"} label="Prix au m²" onChange={(value) => setPrixType(value as "FIXE" | "M2")} />
                  </div>
                </div>
                
                {/* Commission per m² for all property types */}
                <div className="col-span-2 sm:col-span-1">
                  <Label>Commission par m² (DH)</Label>
                  <Input 
                    name="commissionPerM2" 
                    type="number" 
                    placeholder="ex: 500" 
                    value={commissionPerM2 === "" ? "" : Number(commissionPerM2)} 
                    onChange={e => {
                      const value = e.target.value;
                      setCommissionPerM2(value);
                      if (value !== "") {
                        const error = validateNonNegativeNumber(value, "La commission par m²");
                        setErrors(prev => ({ ...prev, commissionPerM2: error }));
                      } else {
                        setErrors(prev => ({ ...prev, commissionPerM2: "" }));
                      }
                    }}
                    min="0"
                    step={0.01}
                  />
                  {errors.commissionPerM2 && <p className="text-sm text-red-500 mt-1">{errors.commissionPerM2}</p>}
                </div>
                
                {prixType === "FIXE" ? (
                  <div className="col-span-2 sm:col-span-1">
                    <Label>Prix total (DH) <span className="text-red-500">*</span></Label>
                    <Input 
                      name="prixTotal" 
                      type="number" 
                      placeholder="ex: 1000000" 
                      value={prixTotal} 
                      onChange={e => {
                        const value = e.target.value;
                        setPrixTotal(value);
                        const error = validatePositiveNumber(value, "Le prix total");
                        setErrors(prev => ({ ...prev, prixTotal: error }));
                      }}
                      min="0.01"
                      step={0.01}
                    />
                    {errors.prixTotal && <p className="text-sm text-red-500 mt-1">{errors.prixTotal}</p>}
                  </div>
                ) : (
                  <>
                    <div className="col-span-2 sm:col-span-1">
                      <Label>Prix par m² (DH) <span className="text-red-500">*</span></Label>
                      <Input 
                        name="prixM2" 
                        type="number" 
                        placeholder="ex: 10000" 
                        value={prixM2} 
                        onChange={e => {
                          const value = e.target.value;
                          setPrixM2(value);
                          const error = validatePositiveNumber(value, "Le prix par m²");
                          setErrors(prev => ({ ...prev, prixM2: error }));
                        }}
                        min="0.01"
                        step={0.01}
                      />
                      {errors.prixM2 && <p className="text-sm text-red-500 mt-1">{errors.prixM2}</p>}
                    </div>
                    
                    {shouldShowStandardFields() && (
                      <>
                        <div className="col-span-2 sm:col-span-1">
                          <Label>Prix balcon (% du prix au m² habitable)</Label>
                          <Input 
                            name="prixBalconPct" 
                            type="number" 
                            placeholder="ex: 50" 
                            value={prixBalconPct} 
                            onChange={e => {
                              const value = e.target.value;
                              setPrixBalconPct(value);
                              const error = validatePercentage(value, "Le pourcentage balcon");
                              if (error) {
                                setErrors(prev => ({ ...prev, prixBalconPct: error }));
                              } else {
                                setErrors(prev => ({ ...prev, prixBalconPct: "" }));
                              }
                            }}
                            min="0"
                            max="100"
                            step={0.01}
                          />
                          {prixM2 && surfaces.habitable && (
                            <p className="text-xs text-gray-600 mt-1">
                              <span className="block sm:inline">Prix au m² balcon: {formatPrice(balconPricePerM2)}</span>
                              {Number(surfaces.balcon) > 0 && (
                                <span className="block sm:inline sm:ml-2">
                                  (Total: {formatPrice(calcSummary.balcon)})
                                </span>
                              )}
                            </p>
                          )}
                          {errors.prixBalconPct && (
                            <p className="text-xs text-red-500 mt-1">{errors.prixBalconPct}</p>
                          )}
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <Label>Prix terrasse (% du prix au m² habitable)</Label>
                          <Input 
                            name="prixTerrassePct" 
                            type="number" 
                            placeholder="ex: 30" 
                            value={prixTerrassePct} 
                            onChange={e => {
                              const value = e.target.value;
                              setPrixTerrassePct(value);
                              const error = validatePercentage(value, "Le pourcentage terrasse");
                              if (error) {
                                setErrors(prev => ({ ...prev, prixTerrassePct: error }));
                              } else {
                                setErrors(prev => ({ ...prev, prixTerrassePct: "" }));
                              }
                            }}
                            min="0"
                            max="100"
                            step={0.1}
                          />
                          {prixM2 && surfaces.habitable && (
                            <p className="text-xs text-gray-600 mt-1">
                              <span className="block sm:inline">Prix au m² terrasse: {formatPrice(terrassePricePerM2)}</span>
                              {Number(surfaces.terrasse) > 0 && (
                                <span className="block sm:inline sm:ml-2">
                                  (Total: {formatPrice(calcSummary.terrasse)})
                                </span>
                              )}
                            </p>
                          )}
                          {errors.prixTerrassePct && (
                            <p className="text-xs text-red-500 mt-1">{errors.prixTerrassePct}</p>
                          )}
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <Label>Prix piscine (DH/m²)</Label>
                          <Input 
                            name="prixPiscine" 
                            type="number" 
                            placeholder="ex: 5000" 
                            value={prixPiscine} 
                            onChange={e => {
                              const value = e.target.value;
                              setPrixPiscine(value);
                              const num = Number(value);
                              if (value !== "" && (isNaN(num) || num < 0)) {
                                setErrors(prev => ({ ...prev, prixPiscine: "Le prix piscine doit être un nombre positif" }));
                              } else {
                                setErrors(prev => ({ ...prev, prixPiscine: "" }));
                              }
                            }}
                            min="0"
                            step={0.01}
                          />
                          {prixPiscine && surfaces.piscine && (
                            <p className="text-xs text-gray-600 mt-1">
                              <span className="block sm:inline">Total piscine: {formatPrice(calcSummary.piscine)}</span>
                            </p>
                          )}
                          {errors.prixPiscine && (
                            <p className="text-xs text-red-500 mt-1">{errors.prixPiscine}</p>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}
                
                {/* Parking for Villa, Apartment, Duplex only */}
                {(shouldShowStandardFields() || formData.type === "VILLA" || formData.type === "DUPLEX") && (
                  <div className="col-span-2 flex flex-col gap-2 mt-2">
                    <Checkbox label="Parking disponible" checked={parkingDisponible} onChange={setParkingDisponible} />
                    {parkingDisponible && (
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center ml-4">
                        <Checkbox label="Inclus dans le prix" checked={parkingInclus} onChange={setParkingInclus} />
                        {!parkingInclus && (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                            <Label className="whitespace-nowrap">Prix du parking (DH)</Label>
                            <Input 
                              name="prixParking" 
                              type="number" 
                              placeholder="ex: 100000" 
                              value={prixParking} 
                              onChange={e => {
                                const value = e.target.value;
                                setPrixParking(value);
                                const num = Number(value);
                                if (value !== "" && (isNaN(num) || num < 0)) {
                                  setErrors(prev => ({ ...prev, prixParking: "Le prix parking doit être un nombre positif" }));
                                } else {
                                  setErrors(prev => ({ ...prev, prixParking: "" }));
                                }
                              }}
                              min="0"
                              step={0.01}
                              className="w-full sm:w-auto"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Conditional calculation summary */}
              {shouldShowStandardFields() && (
                <div className="mt-8 mb-4 p-4 bg-blue-50 border border-blue-200 dark:border-blue-200 dark:bg-blue-900 rounded-lg">
                <h4 className="font-semibold mb-2 dark:text-white">Calcul du prix total</h4>
                <div className="space-y-1 text-sm dark:text-gray-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span>Surface habitable ({surfaces.habitable || 0} m²):</span>
                      <span className="font-medium dark:text-white">{calcSummary.main.toLocaleString()} DH</span>
                    </div>
                    {Number(surfaces.balcon) > 0 && (
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span>Balcon ({surfaces.balcon} m²):</span>
                        <span className="font-medium dark:text-white">{calcSummary.balcon.toLocaleString()} DH</span>
                      </div>
                    )}
                    {Number(surfaces.terrasse) > 0 && (
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span>Terrasse ({surfaces.terrasse} m²):</span>
                        <span className="font-medium dark:text-white">{calcSummary.terrasse.toLocaleString()} DH</span>
                      </div>
                    )}
                    {Number(surfaces.piscine) > 0 && (
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span>Piscine ({surfaces.piscine} m²):</span>
                        <span className="font-medium dark:text-white">{calcSummary.piscine.toLocaleString()} DH</span>
                      </div>
                    )}
                    {parkingDisponible && (
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span>Parking:</span>
                        <span className="font-medium dark:text-white">{calcSummary.parking.toLocaleString()} DH</span>
                      </div>
                    )}
                    {Number(commissionPerM2) > 0 && (
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span>Commission:</span>
                        <span className="font-medium dark:text-white">{calcSummary.commissionTotal.toLocaleString()} DH</span>
                      </div>
                    )}
                    <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-300 flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-bold text-blue-900 dark:text-blue-100">Total:</span>
                      <span className="font-bold text-blue-900 dark:text-blue-100">{calcSummary.total.toLocaleString()} DH</span>
                    </div>
                  </div>
                </div>
              )}
              
              {!shouldShowStandardFields() && (
                <div className="mt-6 sm:mt-8 mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 dark:border-blue-200 dark:bg-blue-900 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm sm:text-base dark:text-white">Calcul du prix total</h4>
                  <div className="space-y-1 text-xs sm:text-sm dark:text-gray-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span>Surface totale ({landStoreFields.totalArea || 0} m²):</span>
                      <span className="font-medium dark:text-white">{calcSummary.main.toLocaleString()} DH</span>
                    </div>
                    {isStoreType() && Number(landStoreFields.mezzanineArea) > 0 && (
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span>Mezzanine ({landStoreFields.mezzanineArea} m²):</span>
                        <span className="font-medium dark:text-white">{calcSummary.mezzanine.toLocaleString()} DH</span>
                      </div>
                    )}
                    {parkingDisponible && (
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span>Parking:</span>
                        <span className="font-medium dark:text-white">{calcSummary.parking.toLocaleString()} DH</span>
                      </div>
                    )}
                    {Number(commissionPerM2) > 0 && (
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span>Commission:</span>
                        <span className="font-medium dark:text-white">{calcSummary.commissionTotal.toLocaleString()} DH</span>
                      </div>
                    )}
                    <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-300 flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-bold text-blue-900 dark:text-blue-100">Total:</span>
                      <span className="font-bold text-blue-900 dark:text-blue-100">{calcSummary.total.toLocaleString()} DH</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Button size="sm" variant="outline" onClick={handlePreviousStep} className="w-full sm:w-auto">Précédent</Button>
                <Button size="sm" type="submit" className="w-full sm:w-auto">Enregistrer</Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}