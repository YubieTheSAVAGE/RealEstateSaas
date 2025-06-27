import React from "react";
import { Card, CardDescription, CardTitle } from "../../ui/card";
import { ContractTemplate } from "@/types/ContractTemplate";
import { FaShieldAlt, FaHome, FaMapMarkerAlt, FaBuilding, FaFile } from "react-icons/fa";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { PiDownloadSimple } from "react-icons/pi";
import AssignTemplateModal from "@/components/example/ModalExample/AssignTemplateModal";
import { Role, Status } from "@/types/user";
import EditTemplateModal from "@/components/example/ModalExample/EditTemplateModal";

interface TemplateCardProps {
    template: ContractTemplate;
}

const dummyTemplate: ContractTemplate = {
  id: 1,
  name: "Template 1",
  description: "Description 1",
  content: "CONTRAT DE RÉSERVATION Entre les soussignés : D'une part, [nom_entreprise],",
  createdAt: new Date(),
  updatedAt: new Date(),
  assignedProjects: [
    {
      id: 1,
      name: "Project 1",
      numberOfApartments: 10,
      address: "123 Main St",
      totalSurface: 100,
    },
    {
      id: 2,
      name: "Project 2",
      numberOfApartments: 20,
      address: "456 Main St",
      totalSurface: 200,
    },
  ],
  createdBy: {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "1234567890",
    status: Status.ACTIVE,
    role: Role.ADMIN,
    passwordHash: "1234567890",
  },
  isDefault: true,
};

export default function TemplateCard({ template }: TemplateCardProps) {
  // Dummy data for preview (replace with real data as needed)
  const assignedProject = template.assignedProjects[0];
  const projectLocation = assignedProject?.address || "Casablanca";
  const projectUnits = assignedProject?.numberOfApartments || 45;
  const contentPreview = template.content || "CONTRAT DE RÉSERVATION Entre les soussignés : D'une part, [nom_entreprise],"; 

  // Function to truncate content to 5 lines
  const truncateContent = (content: string) => {
    const lines = content.split('\n');
    return lines.slice(0, 5).join('\n');
  };

  return (
    <div className="relative w-full max-w-md rounded-2xl border border-blue-200 bg-white shadow-lg p-0">
      {/* Top colored icon/avatar */}
      <div className="absolute -top-6 left-6 bg-green-500 rounded-full p-3 shadow-md">
        <FaFile className="text-white text-2xl" />
      </div>
      <div className="absolute -top-6 right-6">
        <EditTemplateModal template={template} />
      </div>
      {/* Card content */}
      <div className="pt-10 pb-6 px-6">
        {template.isDefault && (
          <div className="text-xs text-blue-500 font-semibold mb-1">Template par défaut</div>
        )}
        <div className="text-xl font-bold text-gray-900 mb-2 leading-tight">{template.name}</div>
        <div className="text-md text-gray-600 mb-6">{template.description}</div>
        {/* Project info */}
        <div className="bg-green-50 rounded-xl p-4 mb-4">
          <div className="flex items-center mb-1 text-gray-500 text-sm font-semibold">
            <FaHome className="mr-2 text-green-400" /> Projet assigné
          </div>
          {template.assignedProjects.map((project) => (
            <div key={project.id} className="flex flex-row items-center gap-2">
              <div className="font-bold text-lg text-gray-900 mb-1">{project.name}</div>
              <span className="text-gray-500 text-sm">·</span>
              <div className="flex items-center text-gray-500 text-sm">
                <FaBuilding className="mr-1" /> {project.numberOfApartments} unités
              </div>
            </div>
          ))}
        </div>
        {/* Content preview */}
        <div className="bg-green-50 rounded-xl p-4 mb-6">
          <div className="flex items-center mb-1 text-gray-500 text-sm font-semibold">
            <FaHome className="mr-2 text-green-400" /> Aperçu du contenu
          </div>
          <div className="text-gray-700 text-sm font-semibold line-clamp-5 whitespace-pre-line">
            {truncateContent(contentPreview)}
          </div>
        </div>
        {/* Buttons */}
        <div className="flex flex-col gap-2 mb-4">
          <AssignTemplateModal projects={dummyTemplate.assignedProjects} template={dummyTemplate} />
          <button className="w-full border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg bg-white hover:bg-gray-50 transition flex items-center justify-center gap-2"><PiDownloadSimple />Télécharger ce template</button>
        </div>
        {/* Footer */}
        <div className="text-xs text-gray-400 text-center">Créé le {template.createdAt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })} par {template.createdBy.name}</div>
      </div>
    </div>
  );
}




