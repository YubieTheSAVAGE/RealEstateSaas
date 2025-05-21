import React, { useState } from "react";
import { Property } from "@/types/property";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { CardDescription, CardTitle } from "@/components/ui/card";
import Badge from "@/components/ui/badge/Badge";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [isOpen, setIsOpen] = useState(false);
  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  function closeDropdown() {
    setIsOpen(false);
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center h-[160px] w-full bg-gray-100 rounded-lg text-gray-400">
        No property data available
      </div>
    );
  }
   
  
  return (
     <div>
      <div className="flex flex-col gap-5 mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-white/[0.03] sm:flex-row sm:items-center sm:gap-6 transition-shadow hover:shadow-2xl">
        <div className="overflow-hidden rounded-lg w-full sm:w-1/2 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 sm:h-[320px] h-[220px]">
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
            {property?.image ? (
              <PhotoView src={property.image}>
                <img
                  width={448}
                  height={320}
                  src={property.image}
                  alt="card"
                  className="overflow-hidden rounded-lg object-cover object-center transition-all duration-200 ease-in-out hover:scale-105 shadow-md border border-gray-200 dark:border-gray-700 w-full h-full max-h-[320px]"
                />
              </PhotoView>
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-lg text-gray-400 text-lg font-semibold">
                No image available
              </div>
            )}
          </PhotoProvider>
        </div>
        <div className="relative w-full">
          <div className="absolute right-0 h-fit -top-5">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              coucou
              {/* <EditProjectModal ProjectData={ProjectDetails} details={true} />
              <DeleteModal
                itemId={ProjectDetails.id}
                heading="Delete Project"
                description="Are you sure you want to delete this project? This action cannot be undone."
                onDelete={() => {
                  // Handle delete action here
                  console.log("Project deleted");
                }}
                details={true}
              /> */}
            </Dropdown>
          </div>
          {property.project?.name && (
            <CardTitle>{property.project.name}</CardTitle>
          )}

          <CardDescription>
            <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Type:</span> {property.type}
              </div>
              <span className="border-b border-gray-200 dark:border-gray-700"></span>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Floor:</span> {property.floor}
              </div>
              <span className="border-b border-gray-200 dark:border-gray-700"></span>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Number:</span> {property.number}
              </div>
              <span className="border-b border-gray-200 dark:border-gray-700"></span>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Zone:</span> {property.zone}
              </div>
              <span className="border-b border-gray-200 dark:border-gray-700"></span>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Area:</span> {property.area} m²
              </div>
              <span className="border-b border-gray-200 dark:border-gray-700"></span>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Price/m²:</span> <span className="text-success-600">{property.pricePerM2.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'MAD',
                })} / m²</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Price:</span> <span className="text-success-600">{property.price.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'MAD',
                })}</span>
              </div>
              <span className="border-b border-gray-200 dark:border-gray-700"></span>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Status:</span> 
                <Badge
                  className="w-fit"
                  size="sm"
                  color={
                    property.status?.toUpperCase() === "AVAILABLE"
                      ? "success"
                      : property.status?.toUpperCase() === "RESERVED"
                      ? "warning"
                      : "error"
                  }

                >
                  {property.status || "Unknown"}
                </Badge>
              </div>
              <span className="border-b border-gray-200 dark:border-gray-700"></span>
              {property.notes && (
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Notes:</span> {property.notes}
                </div>
              )}
            </div>
          </CardDescription>
          {/* <EditProjectModal ProjectData={ProjectDetails}  details={true} /> */}
          
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
