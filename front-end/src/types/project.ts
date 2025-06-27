import { Property } from './property';

export interface Project {
  id: number;
  name: string;
  image?: File | null;
  address: string;
  totalSurface: number;
  numberOfApartments: number;
  notes?: string | null;
  apartments?: Property[]; // You may define Property interface separately
  totalSales?: number;
  commission?: number;
  folderFees?: number;
  status?: "planification" | "construction" | "done";
  createdAt?: Date;
  updatedAt?: Date;
  lastUpdate?: string | Date;
  progress?: number;
  statusDates?: {
    planification?: string | Date;
    construction?: string | Date;
    done?: string | Date;
  };
}