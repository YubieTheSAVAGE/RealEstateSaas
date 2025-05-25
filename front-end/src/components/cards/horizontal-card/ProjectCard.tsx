import { CardDescription, CardTitle } from "../../ui/card";
import { useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import 'react-photo-view/dist/react-photo-view.css';
import PropertiesCategoryPieChart from "@/components/crm/PropertiesCategoryPieChart";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import EditProjectModal from "@/components/example/ModalExample/EditProjectModal";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import DeleteModal from "@/components/example/ModalExample/DeleteModal";
import deleteProperties from "@/components/tables/DataTables/Projects/deleteProperties";
import { useRouter } from "next/navigation";
import { Project } from "@/types/project";

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

  return (
    <div>
      <div className="flex flex-col gap-5 mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:flex-row sm:items-center sm:gap-6">
        <div className="overflow-hidden rounded-lg w-1/2">
          {/* <PhotoProvider> */}
          <PhotoProvider
              maskOpacity={0.7}
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
            <PhotoView src={ProjectDetails.image ?? undefined}>
              <img
                width={448}
                height={140}
                src={ProjectDetails.image ?? ""}
                alt="card"
                className="overflow-hidden rounded-lg object-cover object-center transition-all duration-200 ease-in-out hover:scale-105 sm:h-[160px] sm:w-[448px]"
              />
            </PhotoView>
          </PhotoProvider>
        </div>
        <div className="relative w-full">
          <div className="absolute right-0 h-fit">
            <button onClick={toggleDropdown} className="dropdown-toggle">
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
          <CardTitle>{ProjectDetails.name}</CardTitle>

          <CardDescription>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700 dark:text-gray-200">Address:</span>
              <span className="text-gray-500 dark:text-gray-400">{ProjectDetails.address}</span>
              </div>
              <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700 dark:text-gray-200">Total Surface:</span>
              <span className="text-gray-500 dark:text-gray-400">{ProjectDetails.totalSurface} m²</span>
              </div>
              <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700 dark:text-gray-200">Properties:</span>
              <span className="text-gray-500 dark:text-gray-400">{totalSales} / {ProjectDetails.numberOfApartments}</span>
              </div>
              <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700 dark:text-gray-200">Total Revenue:</span>
              <span className="text-green-600 dark:text-green-400 font-bold">{totalRevenue} MAD</span>
              </div>
            </div>
          </CardDescription>
          {/* <EditProjectModal ProjectData={ProjectDetails}  details={true} /> */}
          
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 mb-6">
        <div className="col-span-2 sm:col-span-1">
          <PropertiesCategoryPieChart apartements={ProjectDetails.apartments ?? []}/>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <MonthlySalesChart apartements={ProjectDetails.apartments ?? []}/>
        </div>
      </div>
    </div>
  );
}
