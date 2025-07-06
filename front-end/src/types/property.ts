import { Client } from "./client";
import { Project } from "./project";
import { PaymentPlan } from "./Payment";

export type PropertyType = "APARTMENT" | "DUPLEX" | "VILLA" | "PENTHOUSE" | "STUDIO" | "LOFT" | "TOWNHOUSE" | "STORE" | "OFFICE" | "WAREHOUSE" | "LAND" | "GARAGE" | "PARKING";
export type ApartmentStatus = "AVAILABLE" | "RESERVED" | "SOLD";

export interface Property {
  // Core identification fields
  id: number;
  number: string;
  type: PropertyType;
  status: ApartmentStatus;
  
  // Location and structural information
  // for multi-story properties (not required for LAND, GARAGE, PARKING)
  floor?: number;
  //for villa and apartments and duplex
  zone?: string;
  
  // Media and documentation
  image?: string | null;
  notes?: string | null;
  
  // Relationships
  project: Project;
  client?: Client | null;
  userId?: number | null;
  interestedClients?: Client[] | null; // List of clients interested in this property
  
  // Timestamps
  updatedAt?: Date | string | undefined; // Use Date for consistency, can be string if coming from API
  
  // Surface measurements for Villa, Apartment, Duplex
  habitable?: number; // Surface habitable in m²
  balcon?: number; // Surface balcon in m²
  terrasse?: number; // Surface terrasse in m²
  piscine?: number; // Surface piscine in m²
  
  // Land and Store specific measurements
  totalArea?: number; // Surface totale for Land and Store types
  mezzanineArea?: number; // Surface mezzanine for Store type
  mezzaninePrice?: number; // Prix mezzanine for Store type
  
  // Pricing configuration
  prixType?: "FIXE" | "M2"; // Type de prix: fixe or per m²
  prixTotal: number; // Prix total for FIXE type
  commissionPerM2?: number;
  prixM2?: number; // Prix par m² for M2 type
  payments?: PaymentPlan;
  
  // Percentage-based pricing for annexes
  prixBalconPct?: number; // Pourcentage du prix au m² pour balcon
  prixTerrassePct?: number; // Pourcentage du prix au m² pour terrasse
  prixPiscine?: number; // Prix piscine par m²
  
  // Parking configuration and pricing
  parkingDisponible?: boolean; // Whether parking is available
  parkingInclus?: boolean; // Whether parking is included in price
  prixParking?: number; // Prix du parking
}