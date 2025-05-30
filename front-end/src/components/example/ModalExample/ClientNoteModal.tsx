"use client";
import React from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { useModal } from "@/hooks/useModal";
import { Textarea } from "@/components/ui/textarea";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

interface ClientNoteModalProps {
  clientNote: string;
}

export default function ClientNoteModal(clientNoteModalProps: ClientNoteModalProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    console.log("Enregistrement des modifications...");
    closeModal();
  };
  return (
    <>
      <DropdownItem
        onItemClick={openModal}
        className="text-gray-500 hover:text-error-400 dark:text-gray-400 dark:hover:text-warning-400 cursor-pointer"
      >
        AJOUTER/MODIFIER
      </DropdownItem>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form className="">
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Note
          </h4>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-2">
              <Textarea
                defaultValue={clientNoteModalProps.clientNote}
                placeholder="Écrivez votre note ici..."
                className="h-32"
              />
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
