"use client";
import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { CloseLineIcon } from "@/icons";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { Project } from "@/types/project";
import { ContractTemplate } from "@/types/ContractTemplate";

interface AssignTemplateModalProps {
  projects: Project[] ;
  template: ContractTemplate;
  assignedProjectId?: string;
  onAssign?: (projectId: string) => void;
}

export default function AssignTemplateModal({
  projects,
  template,
  assignedProjectId,
  onAssign,
}: AssignTemplateModalProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>(assignedProjectId ? [assignedProjectId] : []);
  const [saving, setSaving] = useState(false);

  const handleAssign = (projectId: string) => {
    setSelectedProjectIds(prev => [...prev, projectId]);
  };

  const handleDeselect = (projectId: string) => {
    setSelectedProjectIds(prev => prev.filter(id => id !== projectId));
  };

  const handleSave = async () => {
    if (selectedProjectIds.length === 0) return;
    setSaving(true);
    for (const projectId of selectedProjectIds) {
      await onAssign?.(projectId);
    }
    setSaving(false);
    closeModal();
  };

  return (
    <div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2" onClick={openModal}><MdOutlineRealEstateAgent />Assigner ce template</button>
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[420px] p-0 rounded-2xl overflow-hidden"
        >
          <div className="relative p-6 pb-0 flex items-center justify-between">
            <h2 className="font-semibold text-xl">Assigner le template</h2>
            {/* <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1 rounded hover:bg-gray-100 focus:outline-none"
              aria-label="Fermer"
            >
              <CloseLineIcon className="w-6 h-6 text-gray-400" />
            </button> */}
          </div>
          <div className="p-6 pt-4">
            <div className="mb-4 font-semibold text-base">{template.name}</div>
            <div className="mb-4 text-sm text-gray-500">
              {template.description}
            </div>
            <div className="mb-3 text-sm font-medium flex items-center justify-between">
              <span>Sélectionner un projet</span>
            </div>
            <div className="flex flex-col gap-3">
              {projects.map((project) => {
                const isAssigned = assignedProjectId === project.id.toString();
                const isSelected = selectedProjectIds.includes(project.id.toString());
                return (
                  <button
                    key={project.id}
                    onClick={() =>
                      isSelected
                        ? handleDeselect(project.id.toString())
                        : handleAssign(project.id.toString())
                    }
                    className={`w-full text-left rounded-xl border px-4 py-3 transition-all focus:outline-none
                      ${isAssigned ? "border-primary-400 bg-primary-50 dark:bg-primary-900/20" : "border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700"}
                      ${isSelected && !isAssigned ? "ring-2 ring-blue-400" : ""}
                    `}
                    disabled={isAssigned}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-base text-gray-900 dark:text-gray-100">{project.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{project.address}</div>
                      </div>
                      {isAssigned && (
                        <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">Assigné</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-end w-full gap-3 mt-8">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Fermer
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={selectedProjectIds.length === 0 || saving}
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </Modal>
    </div>
  );
}
