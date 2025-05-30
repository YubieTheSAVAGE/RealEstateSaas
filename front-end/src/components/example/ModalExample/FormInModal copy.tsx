"use client";
import React from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";

export default function FormInModal() {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    console.log("Enregistrement des modifications...");
    closeModal();
  };
  return (
    <>
      <Button size="sm" onClick={openModal}>
        Ouvrir
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form className="">
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Informations personnelles
          </h4>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1">
              <Label>Prénom</Label>
              <Input type="text" placeholder="Prénom" />
            </div>

            <div className="col-span-1">
              <Label>Nom</Label>
              <Input type="text" placeholder="Nom" />
            </div>

            <div className="col-span-1">
              <Label>Email</Label>
              <Input type="email" placeholder="email@exemple.com" />
            </div>

            <div className="col-span-1">
              <Label>Téléphone</Label>
              <Input type="text" placeholder="+33 6 12 34 56 78" />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <Label>Bio</Label>
              <Input type="text" placeholder="Responsable d'équipe" />
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Fermer
            </Button>
            <Button size="sm" onClick={handleSave}>
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
