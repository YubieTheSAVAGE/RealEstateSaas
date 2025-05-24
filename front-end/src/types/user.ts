export enum Role {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT'
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  status: Status;
  notes?: string;
  role: Role;
  passwordHash: string;
  
  // Relationships (optional for frontend usage)
  clients?: any[];
  apartments?: any[];
  createdTasks?: any[];
}
