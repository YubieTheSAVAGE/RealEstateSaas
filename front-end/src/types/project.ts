import { Property } from './property';

export interface Project {
  // Basic identification
  id: number;
  name: string;
  
  // Project specifications
  numberOfProperties: number;
  totalSurface: number;
  address: string;
  latitude: number;
  longitude: number;
  
  // Financial information
  folderFees: number;
  commissionPerM2: number;
  totalSales?: number;
  
  // Project status and progress
  status: "planification" | "construction" | "done";
  progress: number; // Percentage of construction progress (0-100)
  
  // Media and documentation
  image?: File | null; // Project image/plan
  constructionPhotos?: File[]; // Photos from construction progress
  notes?: string | null; // Additional project notes
  
  // Related data
  properties?: Property[]; // Array of properties/apartments in the project
  
  // Timestamps and tracking
  createdAt?: Date;
  updatedAt?: Date;
  lastUpdate?: string | Date;
  statusDates?: {
    planification?: string | Date;
    construction?: string | Date;
    done?: string | Date;
  };
}