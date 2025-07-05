"use client"
import React, { useState } from "react";
import { Payment } from "../../../types/Payment";
import { Property } from "../../../types/property";
import { FaRegCreditCard, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Payment Status Card
export const PaymentStatusCard: React.FC<{
  payments: Payment[];
}> = ({ payments }) => {
  const paid = payments.filter((p) => p.status === "PAID").length;
  const total = payments.length;
  return (
    <div className="bg-blue-100 rounded-2xl shadow-lg p-6 min-w-[260px] min-h-[150px] flex flex-col items-center justify-center m-2">
      <FaRegCreditCard size={32} className="mb-2 text-blue-500" />
      <div className="font-semibold text-lg text-blue-700">Paiements</div>
      <div className="text-2xl font-bold text-blue-700">
        {paid} <span className="font-normal">/ {total}</span>
      </div>
      <div className="text-sm text-blue-400 mt-1">Paiements effectués</div>
    </div>
  );
};

// Next Due Card
export const NextDueCard: React.FC<{
  payments: Payment[];
}> = ({ payments }) => {
  const next = payments.filter((p) => p.status === "PENDING").sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
  if (!next) return null;
  const daysLeft = Math.ceil((new Date(next.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return (
    <div className="bg-yellow-100 rounded-2xl shadow-lg p-6 min-w-[260px] min-h-[150px] flex flex-col items-center justify-center m-2">
      <FaRegCreditCard size={32} className="mb-2 text-yellow-500" />
      <div className="font-semibold text-lg text-yellow-700">Prochaine échéance</div>
      <div className="text-2xl font-bold text-yellow-700">
        {next.amount.toLocaleString()} <span className="font-normal text-lg">DH</span>
      </div>
      <div className="text-sm text-yellow-600 mt-1">
        Dans {daysLeft} jours - {new Date(next.dueDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
      </div>
    </div>
  );
};

// Project Progress Carousel
export const ProjectProgressCarousel: React.FC<{
  properties: Property[];
}> = ({ properties }) => {
  const [index, setIndex] = useState(0);
  if (!properties.length) return null;
  const prop = properties[index];
  // Use prop.project.progress and prop.project.name
  return (
    <div className="bg-green-100 rounded-2xl shadow-lg p-6 min-w-[260px] min-h-[150px] flex flex-col justify-center m-2">
      <div className="flex items-center justify-between w-full">
        <button
          onClick={() => setIndex((i) => (i === 0 ? properties.length - 1 : i - 1))}
          className="bg-transparent border-none text-green-600 text-2xl cursor-pointer p-2 rounded-full hover:bg-green-100 transition"
          aria-label="Précédent"
        >
          <FaChevronLeft />
        </button>
        <div className="flex-1 text-center">
          <div className="font-bold text-2xl text-green-700">
            {prop.project.progress?.toFixed(1) ?? "-"}%
          </div>
          <div className="text-base text-green-700 font-medium">
            {prop.project.name} - {prop.number} 
          </div>
          <div className="text-sm text-green-500 mt-1">Progress du Travaux</div>
          <div className="text-xs text-gray-500 mt-2">
            {index + 1} / {properties.length} projets
          </div>
        </div>
        <button
          onClick={() => setIndex((i) => (i === properties.length - 1 ? 0 : i + 1))}
          className="bg-transparent border-none text-green-600 text-2xl cursor-pointer p-2 rounded-full hover:bg-green-100 transition"
          aria-label="Suivant"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};
