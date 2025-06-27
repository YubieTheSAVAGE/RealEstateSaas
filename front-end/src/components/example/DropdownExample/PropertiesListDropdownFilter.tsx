"use client";
import Checkbox from "@/components/form/input/Checkbox";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import React, { useState, useEffect } from "react";

// Define the filter properties type
export interface PropertyFilters {
  available: boolean;
  reserved: boolean;
  sold: boolean;
  apartment: boolean;
  villa: boolean;
  duplex: boolean;
  store: boolean;
  land: boolean;
}

// Define the component props type
interface PropertiesListDropdownFilterProps {
  onFilterChange?: (filters: PropertyFilters) => void;
  initialFilters?: Partial<PropertyFilters>;
}

export default function PropertiesListDropdownFilter({ 
  onFilterChange,
  initialFilters 
}: PropertiesListDropdownFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>({
    available: false,
    reserved: false,
    sold: false,
    apartment: false,
    villa: false,
    duplex: false,
    store: false,
    land: false,
    ...initialFilters // Merge initial filters with default values
  });

  // Notify parent component when filters change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);

  // Handle checkbox change
  const handleCheckboxChange = (filterName: keyof PropertyFilters) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="relative inline-block">
      <button
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        onClick={toggleDropdown}
      >
        <svg
          className="stroke-current fill-white dark:fill-gray-800"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.29004 5.90393H17.7067"
            stroke=""
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.7075 14.0961H2.29085"
            stroke=""
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
            fill=""
            stroke=""
            strokeWidth="1.5"
          />
          <path
            d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
            fill=""
            stroke=""
            strokeWidth="1.5"
          />
        </svg>
        Filtrer 
        {Object.values(filters).some(value => value) && (
          <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-xs font-medium text-white">
            {Object.values(filters).filter(value => value).length}
          </span>
        )}
      </button>

      <Dropdown
        key={JSON.stringify(filters)}
        className="absolute top-full z-0 mt-2 w-full min-w-[260px] rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-[#1E2635]"
        isOpen={isOpen}
        onClose={closeDropdown}
      >
        <ul className="flex flex-col gap-1">
          <li>
            <DropdownItem
              className="flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <Checkbox 
                label="Disponible"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                checked={filters.available}
                onChange={() => handleCheckboxChange('available')}
              />
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              className="flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <Checkbox
                label="Réservé"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                checked={filters.reserved}
                onChange={() => handleCheckboxChange('reserved')}
              />
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              className="flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <Checkbox
                label="Vendu"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                checked={filters.sold}
                onChange={() => handleCheckboxChange('sold')}
              />
            </DropdownItem>
          </li>
          <li>
            <span className="my-1.5 block h-px w-full bg-gray-200 dark:bg-[#353C49]"></span>
          </li>
          <li>
            <DropdownItem
              className="flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <Checkbox
                label="Appartement"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                checked={filters.apartment}
                onChange={() => handleCheckboxChange('apartment')}
              />
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              className="flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <Checkbox
                label="Villa"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                checked={filters.villa}
                onChange={() => handleCheckboxChange('villa')}
              />
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              className="flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <Checkbox
                label="Duplex"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                checked={filters.duplex}
                onChange={() => handleCheckboxChange('duplex')}
              />
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              className="flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <Checkbox
                label="Magasin"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                checked={filters.store}
                onChange={() => handleCheckboxChange('store')}
              />
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              className="flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <Checkbox
                label="Terrain"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                checked={filters.land}
                onChange={() => handleCheckboxChange('land')}
              />
            </DropdownItem>
          </li>
          <li>
            <span className="my-1.5 block h-px w-full bg-gray-200 dark:bg-[#353C49]"></span>
          </li>
        </ul>
        
        <div className="mt-3 flex items-center justify-between">
          <button 
            onClick={() => {
              setFilters({
                available: false,
                reserved: false,
                sold: false,
                apartment: false,
                villa: false,
                duplex: false,
                store: false,
                land: false
              });
            }}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Tout effacer
          </button>
          <button 
            onClick={closeDropdown}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            Appliquer les filtres
          </button>
        </div>
      </Dropdown>
    </div>
  );
}
