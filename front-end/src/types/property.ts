import { Client } from "./client";
import { Project } from "./project";

export type PropertyType =
  | "APARTMENT" | "DUPLEX" | "VILLA" | "PENTHOUSE" | "STUDIO" | "LOFT" | "TOWNHOUSE"
  | "STORE" | "OFFICE" | "WAREHOUSE"
  | "LAND"
  | "GARAGE" | "PARKING";
export type ApartmentStatus = "AVAILABLE" | "RESERVED" | "SOLD";

export interface Property {
  // Core identification fields
  id: number;
  number: string;
  type: PropertyType;
  status: ApartmentStatus;

  // Location and structural information
  floor?: number | null;
  zone?: string | null;
  area?: number | null;

  // Media and documentation
  image?: string | null;
  notes?: string | null;
  threeDViewUrl?: string | null;

  // Backend pricing fields (matching Prisma schema)
  price: number;              // Backend field name
  pricePerM2?: number | null; // Backend field name
  prixType?: "FIXE" | "M2" | null;

  // Relationships
  project: Project;
  projectId: number;
  client?: Client | null;
  clientId?: number | null;
  userId?: number | null;
  interestedClients?: Client[] | null;

  // Timestamps
  createdAt?: Date | string;
  updatedAt?: Date | string;

  // Legacy frontend fields (for backward compatibility)
  // These are calculated/derived fields, not stored in backend
  prixTotal?: number; // Calculated from price
  prixM2?: number;    // Calculated from pricePerM2
}