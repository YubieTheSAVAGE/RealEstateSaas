import { Client } from "./client";
import { Project } from "./project";

export type PropertyType = "APARTMENT" | "DUPLEX" | "VILLA" | "STORE" | "LAND";
export type ApartmentStatus = "AVAILABLE" | "RESERVED" | "SOLD";

export interface Property {
  id: number;
  number: number;
  floor: number;
  type: PropertyType;
  area: number;
  threeDViewUrl?: string | null;
  price: number;
  pricePerM2: number;
  zone: string;
  image?: string | null;
  status: ApartmentStatus;
  notes?: string | null;
  projectId: number;
  client?: Client | null;
  userId?: number | null;
  project: Project;
  updatedAt: string;
}