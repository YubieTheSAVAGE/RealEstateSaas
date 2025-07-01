import React, { useState } from "react";
import { ContractTemplate } from "@/types/ContractTemplate";
import { FaHome, FaBuilding, FaFile } from "react-icons/fa";
import { PiDownloadSimple } from "react-icons/pi";
import AssignTemplateModal from "@/components/example/ModalExample/AssignTemplateModal";
import { Role, Status } from "@/types/user";
import EditTemplateModal from "@/components/example/ModalExample/EditTemplateModal";
import { downloadTemplate, previewTemplate, TemplateData, getDefaultTemplateData } from "@/utils/templateDownload";

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
      numberOfProperties: 10,
      address: "123 Main St",
      totalSurface: 100,
      latitude: 33.5779,
      longitude: -7.5911,
      folderFees: 1000,
      status: "done",
      progress: 50,
    },
    {
      id: 2,
      name: "Project 2",
      numberOfProperties: 20,
      address: "456 Main St",
      totalSurface: 200,
      latitude: 33.5779,
      longitude: -7.5911,
      folderFees: 1000,
      status: "done",
      progress: 50,
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Dummy data for preview (replace with real data as needed)
  const assignedProject = template.assignedProjects[0];
  const projectLocation = assignedProject?.address || "Casablanca";
  const projectUnits = assignedProject?.numberOfProperties || 45;
  const contentPreview = template.content || "CONTRAT DE RÉSERVATION Entre les soussignés : D'une part, [nom_entreprise],"; 

  // Function to truncate content to 5 lines
  const truncateContent = (content: string) => {
    const lines = content.split('\n');
    return lines.slice(0, 5).join('\n');
  };

  // Handle template download
  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);

    try {
      // Get default template data using examples from dynamicTags
      const defaultData = getDefaultTemplateData();
      
      // Override with project-specific data if available
      const templateData: TemplateData = {
        ...defaultData,
        project: {
          name: assignedProject?.name || defaultData.project?.name,
          address: assignedProject?.address || defaultData.project?.address
        }
      };

      // Download the template
      await downloadTemplate(template, templateData, 'docx');
      
      // Show success message (you could add a toast notification here)
      console.log('Template downloaded successfully!');
      
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadError(error instanceof Error ? error.message : 'Erreur lors du téléchargement');
    } finally {
      setIsDownloading(false);
    }
  };

  // Get preview content with replaced tags
  const previewContent = previewTemplate(template);

  return (
    <div className="relative w-full max-w-md rounded-2xl border border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 shadow-lg p-0">
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
          <div className="text-xs text-blue-500 dark:text-blue-400 font-semibold mb-1">Template par défaut</div>
        )}
        <div className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">{template.name}</div>
        <div className="text-md text-gray-600 dark:text-gray-300 mb-6">{template.description}</div>
        {/* Project info */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-4">
          <div className="flex items-center mb-1 text-gray-500 dark:text-gray-400 text-sm font-semibold">
            <FaHome className="mr-2 text-green-400" /> Projet assigné
          </div>
          {template.assignedProjects.map((project) => (
            <div key={project.id} className="flex flex-row items-center gap-2">
              <div className="font-bold text-lg text-gray-900 dark:text-white mb-1">{project.name}</div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">·</span>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                <FaBuilding className="mr-1" /> {project.numberOfProperties} unités
              </div>
            </div>
          ))}
        </div>
        {/* Content preview */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6">
          <div className="flex items-center mb-1 text-gray-500 dark:text-gray-400 text-sm font-semibold">
            <FaHome className="mr-2 text-green-400" /> Aperçu du contenu
          </div>
          <div className="text-gray-700 dark:text-gray-200 text-sm font-semibold line-clamp-5 whitespace-pre-line">
            {truncateContent(previewContent)}
          </div>
        </div>
        {/* Buttons */}
        <div className="flex flex-col gap-2 mb-4">
          <AssignTemplateModal projects={dummyTemplate.assignedProjects} template={dummyTemplate} />
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className={`w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2 ${
              isDownloading 
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 dark:border-gray-500"></div>
                Téléchargement...
              </>
            ) : (
              <>
                <PiDownloadSimple />
                Télécharger ce template
              </>
            )}
          </button>
          {downloadError && (
            <div className="text-red-500 dark:text-red-400 text-sm text-center mt-2">
              {downloadError}
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="text-xs text-gray-400 dark:text-gray-500 text-center">Créé le {template.createdAt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })} par {template.createdBy.name}</div>
      </div>
    </div>
  );
}




