import Link from "next/link";
import { CardDescription, CardTitle } from "../../ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import 'react-photo-view/dist/react-photo-view.css';
import PropertiesCategoryPieChart from "@/components/crm/PropertiesCategoryPieChart";
import MonthlySalesBarChart from "@/components/charts/bar/MonthlySalesBarChart";
import { Component } from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import EditProjectModal from "@/components/example/ModalExample/EditProjectModal";


interface ProjectCardProps {
  ProjectDetails: any;
}


export default function ProjectCard({ ProjectDetails }: ProjectCardProps) {
  console.log("ProjectDetails", ProjectDetails);
  const calculateTotalSales = (ProjectDetails: any) => {
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

  const totalSales = calculateTotalSales(ProjectDetails);

  return (
    <div>
      <div className="flex flex-col gap-5 mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:flex-row sm:items-center sm:gap-6">
        <div className="overflow-hidden rounded-lg">
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
            <PhotoView src={ProjectDetails.image}>
              <img
                width={224}
                height={140}
                src={ProjectDetails.image}
                alt="card"
                className="overflow-hidden rounded-lg"
              />
            </PhotoView>
          </PhotoProvider>
          {/* <Image
            width={224}
            height={140}
            src={ProjectDetails.image}
            alt="card"
            className="w-full overflow-hidden rounded-lg"
          /> */}
        </div>
        <div>
          <CardTitle>{ProjectDetails.name}</CardTitle>

          <CardDescription>
            <span className="flex flex-col gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Address:</span> {ProjectDetails.address}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Total Surface:</span> {ProjectDetails.totalSurface} m²
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Properties:</span> {totalSales} / {ProjectDetails.numberOfApartments}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Total Revenue:</span> {ProjectDetails.totalPrice} MAD
              </span>
            </span>
          </CardDescription>
          <EditProjectModal ProjectData={ProjectDetails}  details={true} />

        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div className="col-span-1">
          <PropertiesCategoryPieChart apartements={ProjectDetails.apartments}/>
        </div>
        <div className="col-span-1">
          <MonthlySalesChart apartements={ProjectDetails.apartments}/>
        </div>
      </div>
    </div>
  );
}
