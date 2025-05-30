"use client";
import React, { useState } from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import addMonthlyTarget from "./addMonthlyTarget";

interface MonthlyTargetModalProps {
  closeDropdown: () => void;
  onTargetAdded?: () => void; // Optional callback for data refresh
}

export default function MonthlyTargetModal({ onTargetAdded }: MonthlyTargetModalProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    target: "",
    startDate: "",
    endDate: "",
  });

  const handleSave = async () => {

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      console.log("Données du formulaire:", formData);

      const formDataToSend = new FormData();
      formDataToSend.append("target", formData.target);
      formDataToSend.append("startDate", formData.startDate);
      formDataToSend.append("endDate", formData.endDate);

      await addMonthlyTarget(formDataToSend);
      console.log("Objectif mensuel ajouté avec succès");

      // Call callback if provided
      if (onTargetAdded) {
        onTargetAdded();
      }

      // Reset form and close modal
      setFormData({
        target: "",
        startDate: "",
        endDate: ""
      });

      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'objectif mensuel:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form default submission
  };

  return (
    <>
      <DropdownItem
        onClick={openModal}
        className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        Modifier
      </DropdownItem>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form onSubmit={handleFormSubmit}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Objectif mensuel
          </h4>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1 sm:col-span-2">
              <Label>Objectif en MAD</Label>
              <Input
                name="target"
                type="number"
                onChange={handleInputChange}
                defaultValue={formData.target}
                required
              />
            </div>
            <div>
              <Label>Date de début</Label>
              <Input
                name="startDate"
                type="date"
                onChange={handleInputChange}
                defaultValue={formData.startDate}
                required
              />
            </div>
            <div>
              <Label>Date de fin</Label>
              <Input
                name="endDate"
                type="date"
                onChange={handleInputChange}
                defaultValue={formData.endDate}
                required
              />
            </div>
          </div>


          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button
              size="sm"
              variant="outline"
              onClick={closeModal}
            >
              Fermer
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
