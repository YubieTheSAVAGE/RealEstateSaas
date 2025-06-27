import { CardDescription, CardTitle } from "../../ui/card";
import { useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import 'react-photo-view/dist/react-photo-view.css';
import { 
  MdLocationOn, 
  MdSquareFoot, 
  MdHome, 
  MdAttachMoney, 
  MdReceipt, 
  MdTrendingUp,
  MdInfo
} from "react-icons/md";
import PropertiesCategoryPieChart from "@/components/crm/PropertiesCategoryPieChart";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import EditProjectModal from "@/components/example/ModalExample/EditProjectModal";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import DeleteModal from "@/components/example/ModalExample/DeleteModal";
import deleteProperties from "@/components/tables/DataTables/Projects/deleteProperties";
import { useRouter } from "next/navigation";
import { Project } from "@/types/project";
import Badge from "@/components/ui/badge/Badge";

interface ProjectCardProps {
  ProjectDetails: Project;
  onRefresh?: () => void; // Callback to refresh project list after editing
}


export default function ProjectCard({ ProjectDetails, onRefresh }: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const router = useRouter();

  const handleDelete = async (id: string) => {
      const success: boolean = await deleteProperties(id);
      if (!success) {
        console.error("Error deleting project");
        return;
      }
      router.push("/projects");
  }

  

  const calculateTotalSales = (ProjectDetails: Project) => {
    // Check if apartments array exists
    if (!ProjectDetails.apartments || !Array.isArray(ProjectDetails.apartments)) {
      return 0;
    }

    // Count sold apartments
    const soldCount = ProjectDetails.apartments.filter(
      (apartment: { status: string }) => apartment.status === "SOLD"
    ).length;

    return soldCount;
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const calculateTotalRevenue = (ProjectDetails: Project) => {
    // Check if apartments array exists
    if (!ProjectDetails.apartments || !Array.isArray(ProjectDetails.apartments)) {
      return 0;
    }
    // Calculate total revenue from sold apartments
    const totalRevenue = ProjectDetails.apartments.reduce((acc: number, apartment: { status: string; price: number }) => {
      if (apartment.status === "SOLD") {
        return acc + apartment.price;
      }
      return acc;
    }, 0);
    return totalRevenue;
  }

  const totalRevenue = calculateTotalRevenue(ProjectDetails);

  const totalSales = calculateTotalSales(ProjectDetails);

  // Define project steps configuration
  const projectSteps = [
    {
      key: 'planification',
      label: 'Planification',
      isCompleted: ProjectDetails.status === 'construction' || ProjectDetails.status === 'done',
      isActive: ProjectDetails.status === 'planification',
      date: ProjectDetails.statusDates?.planification
    },
    {
      key: 'construction',
      label: 'En construction',
      isCompleted: ProjectDetails.status === 'done',
      isActive: ProjectDetails.status === 'construction',
      date: ProjectDetails.statusDates?.construction
    },
    {
      key: 'done',
      label: 'Terminé',
      isCompleted: ProjectDetails.status === 'done',
      isActive: ProjectDetails.status === 'done',
      date: ProjectDetails.statusDates?.done
    }
  ];

  return (
    <div>
      <div className="flex flex-col gap-5 mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 dark:border-gray-800 dark:bg-white/[0.03] sm:flex-row sm:items-start sm:gap-6">
        <div className="w-full">
          {/* Project Header with Progress */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="font-bold text-lg text-gray-900 dark:text-gray-100">{ProjectDetails.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Dernière mise à jour: {ProjectDetails.lastUpdate ? new Date(ProjectDetails.lastUpdate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}</div>
              </div>
              <div className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{ProjectDetails.progress ?? 0}%</div>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
              <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-gray-300 dark:to-gray-600 transition-all duration-300" style={{ width: `${ProjectDetails.progress ?? 0}%` }}></div>
            </div>
            {/* Stepper */}
            <div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Statut du projet</div>
              <ol className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-2">
                {projectSteps.map((step, index) => (
                  <li key={step.key} className={`${index < projectSteps.length - 1 ? 'mb-6' : ''} ml-4`}>
                    <div 
                      className={`absolute w-3 h-3 bg-white border-2 rounded-full -left-1.5 top-1.5 ${
                        step.isActive || step.isCompleted ? 'border-blue-500' : 'border-gray-300'
                      }`}
                    ></div>
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        step.isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {step.label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        step.isCompleted 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {step.isCompleted ? 'Terminé' : 'En attente'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Terminé: {step.date 
                        ? new Date(step.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) 
                        : 'en attente'
                      }
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg w-full ">
            {!ProjectDetails.image ? (
              <div className="flex items-center justify-center h-56 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-center">
                  <MdHome className="text-gray-400 dark:text-gray-500 text-5xl mx-auto mb-3" />
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">No image available</span>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <PhotoProvider
                  maskOpacity={0.8}
                  toolbarRender={({ onRotate, rotate, onScale, scale }) => {
                    return (
                      <>
                        <svg
                          className="PhotoView-Slider__toolbarIcon"
                          onClick={() => onRotate(rotate + 90)}
                          width="44"
                          height="44"
                          fill="white"
                          viewBox="0 0 768 768"
                        >
                          <path d="M565.5 202.5l75-75v225h-225l103.5-103.5c-34.5-34.5-82.5-57-135-57-106.5 0-192 85.5-192 192s85.5 192 192 192c84 0 156-52.5 181.5-127.5h66c-28.5 111-127.5 192-247.5 192-141 0-255-115.5-255-256.5s114-256.5 255-256.5c70.5 0 135 28.5 181.5 75z" />
                        </svg>
                        <svg
                          className="PhotoView-Slider__toolbarIcon"
                          width="44"
                          height="44"
                          viewBox="0 0 768 768"
                          fill="white"
                          onClick={() => onScale(scale + 0.5)}
                        >
                          <path d="M384 640.5q105 0 180.75-75.75t75.75-180.75-75.75-180.75-180.75-75.75-180.75 75.75-75.75 180.75 75.75 180.75 180.75 75.75zM384 64.5q132 0 225.75 93.75t93.75 225.75-93.75 225.75-225.75 93.75-225.75-93.75-93.75-225.75 93.75-225.75 225.75-93.75zM415.5 223.5v129h129v63h-129v129h-63v-129h-129v-63h129v-129h63z" />
                        </svg>
                        <svg
                          className="PhotoView-Slider__toolbarIcon"
                          width="44"
                          height="44"
                          viewBox="0 0 768 768"
                          fill="white"
                          onClick={() => onScale(scale - 0.5)}
                        >
                          <path d="M384 640.5q105 0 180.75-75.75t75.75-180.75-75.75-180.75-180.75-75.75-180.75 75.75-75.75 180.75 75.75 180.75 180.75 75.75zM384 64.5q132 0 225.75 93.75t93.75 225.75-93.75 225.75-225.75 93.75-225.75-93.75-93.75-225.75 93.75-225.75 225.75-93.75zM223.5 352.5h321v63h-321v-63z" />
                        </svg>
                      </>
                    );
                  }}
                >
                  <PhotoView src={ProjectDetails.image?.toString() ?? undefined}>
                    <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300">
                      <img
                        width={448}
                        height={224}
                        src={ProjectDetails.image ?? ""}
                        alt={`${ProjectDetails.name} project image`}
                        className="w-full h-56 sm:h-64 object-cover object-center transition-all duration-300 ease-in-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </PhotoView>
                </PhotoProvider>
              </div>
            )}
          </div>
        </div>
        <div className="relative w-full pt-12">
          <div className="absolute right-0 top-0 h-fit">
            <button onClick={toggleDropdown} className="dropdown-toggle p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <EditProjectModal ProjectData={ProjectDetails} details={true} onRefresh={handleRefresh} />
              <DeleteModal
                itemId={ProjectDetails.id?.toString()}
                heading="Delete Project"
                description="Are you sure you want to delete this project? This action cannot be undone."
                onDelete={handleDelete}
                details={true}
              />
            </Dropdown>
          </div>
          <CardDescription>
            <div className="space-y-4">
              {/* Location & Surface Group */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                   Détails du projet
                </h4>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MdLocationOn className="text-blue-500 text-lg" />
                    <span className="font-medium">Address:</span>
                    <span>{ProjectDetails.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MdSquareFoot className="text-green-500 text-lg" />
                    <span className="font-medium">Total Surface:</span>
                    <span className="font-semibold">{ProjectDetails.totalSurface} m²</span>
                  </div>
                </div>
              </div>

              {/* Sales & Revenue Group */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                  Ventes & Revenu
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <MdHome className="text-blue-600 text-lg" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Propriétés:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {totalSales} / {ProjectDetails.numberOfApartments}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdTrendingUp className="text-green-600 text-lg" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Total Revenu:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {totalRevenue.toLocaleString()} MAD
                    </span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progression des ventes</span>
                    <span>{Math.round((totalSales / ProjectDetails.numberOfApartments) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(totalSales / ProjectDetails.numberOfApartments) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Fees Group */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide">
                  Frais & Commission
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <MdAttachMoney className="text-green-600 text-lg" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Commission de l'agence:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {ProjectDetails.commission?.toLocaleString()} MAD
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdReceipt className="text-green-600 text-lg" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Frais de dossier:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {ProjectDetails.folderFees?.toLocaleString()} MAD
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Group */}
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide mb-3">
                  Statut du projet
                </h4>
                <div className="flex items-center gap-2">
                  <MdInfo className="text-orange-600 text-lg" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                  <Badge
                    variant={ProjectDetails.status === "planification" ? "light" : "solid"}
                    className="text-white font-semibold px-3 py-1"
                    color={ProjectDetails.status === "planification" ? "warning" : ProjectDetails.status === "construction" ? "primary" : "success"}
                  >
                    {ProjectDetails.status === "planification" ? "Planning" : 
                     ProjectDetails.status === "construction" ? "Under Construction" : 
                     ProjectDetails.status === "done" ? "Completed" : ProjectDetails.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardDescription>
          {/* <EditProjectModal ProjectData={ProjectDetails}  details={true} /> */}
          
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 mb-6">
        <div className="col-span-2 sm:col-span-1">
          <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <MdHome className="text-blue-500" />
              Distribution des propriétés
            </h3>
            <PropertiesCategoryPieChart apartements={ProjectDetails.apartments ?? []}/>
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <MdTrendingUp className="text-green-500" />
              Tendance des ventes mensuelles
            </h3>
            <MonthlySalesChart apartements={ProjectDetails.apartments ?? []}/>
          </div>
        </div>
      </div>
    </div>
  );
}
