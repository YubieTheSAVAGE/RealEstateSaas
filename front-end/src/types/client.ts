export interface Client {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  notes?: string | null;
  provenance: string;
  status: 'LEAD' | 'CLIENT';
  createdById: number;
  // Optionally, you can add these if you want to type relations:
  // apartments?: Apartment[];
  // interestedApartments?: Apartment[];
}
