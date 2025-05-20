"use client";
import React, { useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

interface MonthlyTargetModalProps {
  closeDropdown: () => void;
}

export default function MonthlyTargetModal({ closeDropdown }: MonthlyTargetModalProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };
  
  return (
    <>
      <DropdownItem
        onClick={openModal}
        // onItemClick={closeDropdown}
        className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
          Edit
        {/* </span> */}
      </DropdownItem>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form className="">
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Monthly Target
          </h4>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">

            <div className="col-span-1 sm:col-span-2">
              <Label>Target in MAD</Label>
              <Input type="number" placeholder="10000000" />
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
