"use client";
import React, { useState } from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import Select from "../../form/Select";
import { Textarea } from "@/components/ui/textarea";
import { PencilIcon } from "@/icons";
import { Agent } from "@/types/Agent";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import updateAgent from "@/app/(admin)/agents/updateAgent";

interface AddAgentModalProps {
  // onAgentAdded?: () => void; // Callback to refresh agent list
  onAgentEdited?: () => void; // Callback to refresh agent list after editing
  AgentDetails: Agent;
  details?: boolean; // Optional prop to indicate if it's in details mode
}

export default function EditAgentModal({ AgentDetails, onAgentEdited, details }: AddAgentModalProps) {
  const { isOpen, openModal, closeModal } = useModal();

  // State for form fields
  const [formData, setFormData] = useState({
    id: AgentDetails.id,
    name: AgentDetails.name,
    email: AgentDetails.email,
    phoneNumber: AgentDetails.phoneNumber,
    status: AgentDetails.status,
    notes: AgentDetails.notes,
    password: "", // Will be hashed on the server
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
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


    if (!valid) {
      setErrors(newErrors);
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value != null ? String(value) : "");
    });

    try {
      // await addAgents(formDataToSend);
      await updateAgent(formDataToSend);
      console.log("Enregistrement de l'agent avec les données:", formData);

      // Call the callback function to refresh the agent list
      if (onAgentEdited) {
        onAgentEdited();
      }

      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'agent:", error);
    }
  };

  // Status options
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
      {details ? (
        <DropdownItem
          className="text-gray-500 hover:text-warning-400 dark:text-gray-400 dark:hover:text-warning-400 cursor-pointer"
          onClick={openModal}
        >
          Modifier
        </DropdownItem>
      ) : (
        <span className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 cursor-pointer">
          <PencilIcon onClick={openModal} />
        </span>
      )}
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
                defaultValue={AgentDetails.name}
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
                defaultValue={AgentDetails.status}
                name="status"
                options={statusOptions}
                placeholder="Sélectionner un statut"
                onChange={(value, name) => handleSelectChange(value, name)}
                className="dark:bg-dark-900"
              />
            </div>
            <div className="col-span-1">
              <Label>Numéro de téléphone <span className="text-red-500">*</span></Label>
              <Input
                defaultValue={AgentDetails.phoneNumber}
                name="phoneNumber"
                type="tel"
                placeholder="ex: 06-12-34-56-78"
                onChange={handleChange}
              />
              {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>}
            </div>

            <div className="col-span-1">
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input
                defaultValue={AgentDetails.email}
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
                // defaultValue={"************"}
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>


            <div className="col-span-1 sm:col-span-2">
              <Label>Notes</Label>
              <Textarea
                defaultValue={AgentDetails.notes || ""}
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
              Modifier l&apos;agent
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
