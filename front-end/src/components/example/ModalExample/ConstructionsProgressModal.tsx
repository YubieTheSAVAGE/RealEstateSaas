"use client";
import React, { useState } from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { useModal } from "@/hooks/useModal";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { Label } from "@/components/ui/label";
import Select from "@/components/form/Select";
import Slider from "@/components/ui/slider/Slider";
import MultiImageUpload from "@/components/ui/multi-image-upload/MultiImageUpload";

interface ConstructionsProgressModalProps {
  id: string;
  percentage: number;
  status: string;
}

export default function ConstructionsProgressModal({ percentage, status }: ConstructionsProgressModalProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const [percentageValue, setPercentageValue] = useState(percentage);
  const [statusValue, setStatusValue] = useState(status);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...", { 
      percentageValue, 
      statusValue, 
      uploadedImages: uploadedImages.map(img => img.name) 
    });
    closeModal();
  };

  return (
    <>
      <DropdownItem 
        onItemClick={openModal}
        className="text-gray-500 hover:text-success-600 dark:text-gray-400 dark:hover:text-success-500 cursor-pointer"
      >
        travaux
      </DropdownItem>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        showCloseButton={false}
        className="max-w-[507px] p-6 lg:p-10"
      >
        <div className="text-center">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
            Gestion des travaux
          </h4>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            Gérez les travaux de votre projet.
          </p>
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
            <Label>
              Statut du projet
            </Label>
            <Select
              options={[
                { label: "Planification", value: "planification" },
                { label: "En construction", value: "construction" },
                { label: "Terminé", value: "done" },
              ]}
                defaultValue={statusValue}
                placeholder="Sélectionnez un statut"
                onChange={(value) => setStatusValue(value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Slider
                min={0}
                max={100}
                value={percentageValue}
                onChange={setPercentageValue}
                label="Pourcentage de progression"
                showValue={true}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <MultiImageUpload
                images={uploadedImages}
                onChange={setUploadedImages}
                label="Photos des travaux"
                maxImages={8}
              />
            </div>
            
          </div>

          <div className="flex items-center justify-center w-full gap-3 mt-8">
            <Button size="sm" variant="outline" onClick={closeModal}>
              fermer
            </Button>
            <Button size="sm" onClick={handleSave}>
              Enregistrer les modifications
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
