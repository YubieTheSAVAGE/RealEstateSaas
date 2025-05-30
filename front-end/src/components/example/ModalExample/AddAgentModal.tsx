"use client";
import React, { useState } from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import Select from "../../form/Select";
import addAgents from "@/app/(admin)/agents/addAgents";
import { Textarea } from "@/components/ui/textarea";

interface AddAgentModalProps {
  onAgentAdded?: () => void; // Callback to refresh agent list
}

export default function AddAgentModal({ onAgentAdded }: AddAgentModalProps) {
  const { isOpen, openModal, closeModal } = useModal();

  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    status: "ACTIVE",
    notes: "",
    role: "AGENT",
    password: "", // Will be hashed on the server
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  // Update form field values
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    // Validation
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name) {
      newErrors.name = "Le nom est requis";
      valid = false;
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Une adresse email valide est requise";
      valid = false;
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Le numéro de téléphone est requis";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      await addAgents(formDataToSend);
      console.log("Saving agent with data:", formData);

      // Call the callback function to refresh the agent list
      if (onAgentAdded) {
        onAgentAdded();
      }

      closeModal();
    } catch (error) {
      console.error("Error saving agent:", error);
    }
  };

  const statusOptions = [
    { value: "ACTIVE", label: "Actif" },
    { value: "INACTIVE", label: "Inactif" },
  ];

  const handleSelectChange = (selectedValue: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedValue,
    }));
  };

  return (
    <>
      <Button size="sm" onClick={openModal}>
        Ajouter un agent
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Informations de l&apos;agent
          </h4>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-2">
              <Label>Nom <span className="text-red-500">*</span></Label>
              <Input
                name="name"
                type="text"
                placeholder="Nom complet"
                onChange={handleChange}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div className="col-span-1">
              <Label>Statut <span className="text-red-500">*</span></Label>
              <Select
                defaultValue={statusOptions[0].value}
                name="status"
                options={statusOptions}
                placeholder="Select Status"
                onChange={(value, name) => handleSelectChange(value, name)}
                className="dark:bg-dark-900"
              />
            </div>
            <div className="col-span-1">
              <Label>Numéro de téléphone <span className="text-red-500">*</span></Label>
              <Input
                name="phoneNumber"
                type="tel"
                placeholder="+1234567890"
                onChange={handleChange}
              />
              {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>}
            </div>

            <div className="col-span-1">
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input
                name="email"
                type="email"
                placeholder="email@exemple.com"
                onChange={handleChange}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div className="col-span-1">
              <Label>Mot de passe <span className="text-red-500">*</span></Label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>


            <div className="col-span-1 sm:col-span-2">
              <Label>Notes</Label>
              <Textarea
                className="h-24"
                name="notes"
                placeholder="Notes supplémentaires"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Annuler
            </Button>
            <Button size="sm" onClick={handleSave}>
              Ajouter l&apos;agent
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
