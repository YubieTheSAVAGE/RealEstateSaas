import { Property } from "./property";
import { Payment } from "./Payment";

export interface Client {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  whatsappNumber?: string;
  notes?: string | null;
  provenance: string;
  status: 'PROSPECT' | 'CLIENT';
  createdById: number;
  apartments?: Property[];
  interestedApartments?: Property[];
  payments?: Payment[];
  // Identity document fields (for CLIENT status)
  identityType?: 'Carte d\'identité' | 'Passport';
  identityNumber?: string;
  identityRecto?: string; // File path or URL
  identityVerso?: string; // File path or URL (only for Carte d'identité)
}
