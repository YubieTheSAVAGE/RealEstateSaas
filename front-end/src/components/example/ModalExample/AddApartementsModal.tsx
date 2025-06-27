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
import { Project } from "@/types/project";
import Stepper from "../../ui/stepper/Stepper";
import Radio from "../../form/input/Radio";
import Checkbox from "../../form/input/Checkbox";

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

  // Stepper state
  const [step, setStep] = useState(0);

  // New fields for annex surfaces, parking, and pricing
  const [surfaces, setSurfaces] = useState({
    habitable: "",
    balcon: "",
    terrasse: "",
    piscine: "",
  });
  const [prixType, setPrixType] = useState("FIXE"); // "FIXE" or "M2"
  const [prixM2, setPrixM2] = useState("");
  const [prixTotal, setPrixTotal] = useState("");
  const [prixBalconPct, setPrixBalconPct] = useState("50");
  const [prixTerrassePct, setPrixTerrassePct] = useState("30");
  const [prixPiscine, setPrixPiscine] = useState("");
  const [parkingDisponible, setParkingDisponible] = useState(false);
  const [parkingInclus, setParkingInclus] = useState(false);
  const [prixParking, setPrixParking] = useState("");

  // Calculation logic
  const calcSummary = React.useMemo(() => {
    const hab = Number(surfaces.habitable) || 0;
    const bal = Number(surfaces.balcon) || 0;
    const ter = Number(surfaces.terrasse) || 0;
    const pis = Number(surfaces.piscine) || 0;
    const m2 = Number(prixM2) || 0;
    const balPct = Number(prixBalconPct) / 100;
    const terPct = Number(prixTerrassePct) / 100;
    const pisPrix = Number(prixPiscine) || 0;
    const parkPrix = Number(prixParking) || 0;
    let main = 0, balcon = 0, terrasse = 0, piscine = 0, parking = 0, total = 0;
    if (prixType === "FIXE") {
      total = Number(prixTotal) || 0;
      main = total;
    } else {
      main = hab * m2;
      balcon = bal * (m2 * balPct);
      terrasse = ter * (m2 * terPct);
      piscine = pis * pisPrix;
      parking = parkingDisponible && !parkingInclus ? parkPrix : 0;
      total = main + balcon + terrasse + piscine + parking;
    }
    return { main, balcon, terrasse, piscine, parking, total };
  }, [surfaces, prixType, prixM2, prixTotal, prixBalconPct, prixTerrassePct, prixPiscine, parkingDisponible, parkingInclus, prixParking]);

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

  // Stepper steps
  const steps = [
    { label: "Informations de base" },
    { label: "Surfaces & Tarification" },
  ];

  return (
    <>
      <Button size="sm" onClick={openModal}>
        Ajouter un bien
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        className="max-w-2xl p-5 lg:p-10 m-4"
      >
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Ajouter un bien</h1>
        </div>
        <Stepper steps={steps} currentStep={step} className="mb-6" />
        <div className="custom-scrollbar max-h-[70vh] overflow-y-auto px-1">
          {step === 0 && (
            <form onSubmit={e => { e.preventDefault(); setStep(1); }}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                {/* Project, Type, Floor, Number, Zone, Status, Client, Plan, Notes */}
                <div className="col-span-1">
                  <Label>Projet <span className="text-red-500">*</span></Label>
                  <Select
                    name="id"
                    options={options}
                    placeholder="Sélectionner une option"
                    onChange={(value, name) => handleSelectChange(value, name)}
                    className="dark:bg-dark-900"
                  />
                  {errors.id && <p className="text-sm text-red-500 mt-1">{errors.id}</p>}
                </div>
                <div className="col-span-1">
                  <Label>Type <span className="text-red-500">*</span></Label>
                  <Select
                    name="type"
                    options={type}
                    placeholder="Type"
                    onChange={(value, name) => handleSelectChange(value, name)}
                  />
                  {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
                </div>
                <div className="col-span-1">
                  <Label>Étage <span className="text-red-500">*</span></Label>
                  <Input name="floor" type="number" placeholder="ex: 10" value={formData.floor} onChange={handleChange} />
                  {errors.floor && <p className="text-sm text-red-500 mt-1">{errors.floor}</p>}
                </div>
                <div className="col-span-1">
                  <Label>Numéro <span className="text-red-500">*</span></Label>
                  <Input name="number" type="text" placeholder="ex: 10A" value={formData.number} onChange={handleChange} />
                  {errors.number && <p className="text-sm text-red-500 mt-1">{errors.number}</p>}
                </div>
                <div className="col-span-1">
                  <Label>Zone <span className="text-red-500">*</span></Label>
                  <Input name="zone" type="text" placeholder="ex: Zone 1" value={formData.zone} onChange={handleChange} />
                  {errors.zone && <p className="text-sm text-red-500 mt-1">{errors.zone}</p>}
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
                    {errors.clientId && <p className="text-sm text-red-500 mt-1">{errors.clientId}</p>}
                  </div>
                )}
                <div className="col-span-2">
                  <Label>Plan</Label>
                  <FileInput name="image" onChange={handleFileChange} />
                  {formData.image && <p className="mt-1 text-xs text-green-600">Fichier sélectionné : {formData.image.name}</p>}
                </div>
                <div className="col-span-2">
                  <Label>Notes</Label>
                  <TextArea value={formData.notes} rows={3} placeholder="Ajouter des notes ici" onChange={handleTextAreaChange} />
                </div>
              </div>
              <div className="flex items-center justify-end w-full gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Button size="sm" variant="outline" onClick={handleCloseModal}>Fermer</Button>
                <Button size="sm" type="submit">Suivant</Button>
              </div>
            </form>
          )}
          {step === 1 && (
            <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                {/* Surfaces */}
                <div className="col-span-1">
                  <Label>Surface habitable (m²) <span className="text-red-500">*</span></Label>
                  <Input name="habitable" type="number" placeholder="ex: 100" value={surfaces.habitable} onChange={e => setSurfaces(s => ({ ...s, habitable: e.target.value }))} />
                </div>
                <div className="col-span-1">
                  <Label>Surface balcon (m²)</Label>
                  <Input name="balcon" type="number" placeholder="ex: 10" value={surfaces.balcon} onChange={e => setSurfaces(s => ({ ...s, balcon: e.target.value }))} />
                </div>
                <div className="col-span-1">
                  <Label>Surface terrasse (m²)</Label>
                  <Input name="terrasse" type="number" placeholder="ex: 10" value={surfaces.terrasse} onChange={e => setSurfaces(s => ({ ...s, terrasse: e.target.value }))} />
                </div>
                <div className="col-span-1">
                  <Label>Surface piscine (m²)</Label>
                  <Input name="piscine" type="number" placeholder="ex: 5" value={surfaces.piscine} onChange={e => setSurfaces(s => ({ ...s, piscine: e.target.value }))} />
                </div>
                {/* Pricing type */}
                <div className="col-span-2">
                  <Label>Type de prix <span className="text-red-500">*</span></Label>
                  <div className="flex gap-6 mt-2">
                    <Radio id="prix-fixe" name="prixType" value="FIXE" checked={prixType === "FIXE"} label="Prix fixe" onChange={setPrixType} />
                    <Radio id="prix-m2" name="prixType" value="M2" checked={prixType === "M2"} label="Prix au m²" onChange={setPrixType} />
                  </div>
                </div>
                {prixType === "FIXE" ? (
                  <div className="col-span-2">
                    <Label>Prix total (DH) <span className="text-red-500">*</span></Label>
                    <Input name="prixTotal" type="number" placeholder="ex: 1000000" value={prixTotal} onChange={e => setPrixTotal(e.target.value)} />
                  </div>
                ) : (
                  <>
                    <div className="col-span-1">
                      <Label>Prix par m² habitable (DH) <span className="text-red-500">*</span></Label>
                      <Input name="prixM2" type="number" placeholder="ex: 10000" value={prixM2} onChange={e => setPrixM2(e.target.value)} />
                    </div>
                    <div className="col-span-1">
                      <Label>Prix balcon (% du prix au m² habitable)</Label>
                      <Input name="prixBalconPct" type="number" placeholder="ex: 50" value={prixBalconPct} onChange={e => setPrixBalconPct(e.target.value)} />
                    </div>
                    <div className="col-span-1">
                      <Label>Prix terrasse (% du prix au m² habitable)</Label>
                      <Input name="prixTerrassePct" type="number" placeholder="ex: 30" value={prixTerrassePct} onChange={e => setPrixTerrassePct(e.target.value)} />
                    </div>
                    <div className="col-span-1">
                      <Label>Prix piscine (DH/m²)</Label>
                      <Input name="prixPiscine" type="number" placeholder="ex: 5000" value={prixPiscine} onChange={e => setPrixPiscine(e.target.value)} />
                    </div>
                  </>
                )}
                {/* Parking */}
                <div className="col-span-2 flex flex-col gap-2 mt-2">
                  <Checkbox label="Parking disponible" checked={parkingDisponible} onChange={setParkingDisponible} />
                  {parkingDisponible && (
                    <div className="flex gap-4 items-center ml-4">
                      <Checkbox label="Inclus dans le prix" checked={parkingInclus} onChange={setParkingInclus} />
                      {!parkingInclus && (
                        <div className="flex items-center gap-2">
                          <Label>Prix du parking (DH)</Label>
                          <Input name="prixParking" type="number" placeholder="ex: 100000" value={prixParking} onChange={e => setPrixParking(e.target.value)} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* Calculation summary */}
              <div className="mt-8 mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold mb-2">Calcul du prix total</h4>
                <div className="space-y-1 text-sm">
                  <div>Surface habitable ({surfaces.habitable || 0} m²): <span className="font-medium">{calcSummary.main.toLocaleString()} DH</span></div>
                  {Number(surfaces.balcon) > 0 && <div>Balcon ({surfaces.balcon} m²): <span className="font-medium">{calcSummary.balcon.toLocaleString()} DH</span></div>}
                  {Number(surfaces.terrasse) > 0 && <div>Terrasse ({surfaces.terrasse} m²): <span className="font-medium">{calcSummary.terrasse.toLocaleString()} DH</span></div>}
                  {Number(surfaces.piscine) > 0 && <div>Piscine ({surfaces.piscine} m²): <span className="font-medium">{calcSummary.piscine.toLocaleString()} DH</span></div>}
                  {parkingDisponible && <div>Parking: <span className="font-medium">{calcSummary.parking.toLocaleString()} DH</span></div>}
                  <div className="mt-2 font-bold text-blue-900">Total: {calcSummary.total.toLocaleString()} DH</div>
                </div>
              </div>
              <div className="flex items-center justify-between w-full gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Button size="sm" variant="outline" onClick={() => setStep(0)}>Précédent</Button>
                <Button size="sm" type="submit">Créer le lot</Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}