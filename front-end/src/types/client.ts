import { Property } from "./property";

export interface Client {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  notes?: string | null;
  provenance: string;
  status: 'LEAD' | 'CLIENT';
  createdById: number;
  properties?: Property[];
  interestedApartments?: Property[];
}
