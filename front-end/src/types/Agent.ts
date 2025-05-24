export interface Agent {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  status: 'ACTIVE' | 'INACTIVE';
  notes?: string;
  role: 'AGENT';
  
  // Relationships
  clients?: {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    notes?: string;
    provenance: string;
    status: 'LEAD' | 'CLIENT';
  }[];
  
  apartments?: {
    id: number;
    number: number;
    floor: number;
    type: 'APARTMENT' | 'DUPLEX' | 'VILLA' | 'STORE' | 'LAND';
    area: number;
    price: number;
    status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  }[];
  
  createdTasks?: {
    id: number;
    title: string;
    description?: string;
    dueDate: Date;
    status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  }[];
}
