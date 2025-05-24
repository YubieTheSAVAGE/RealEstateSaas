import { Property } from './property';

export interface Project {
  id: number;
  name: string;
  image?: string | null;
  address: string;
  totalSurface: number;
  numberOfApartments: number;
  notes?: string | null;
  apartments?: Property[]; // You may define Property interface separately
}