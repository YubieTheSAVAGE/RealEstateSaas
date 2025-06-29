import { Property } from "@/types/property";
import { Payment } from "@/types/Payment";
import { Client } from "@/types/client";

    // Dummy property
const dummyProperty: Property = {
    id: 1,
    number: 'A-101',
    type: 'APARTMENT',
    status: 'SOLD',
    project: { id: 1, name: 'Projet Atlas', numberOfProperties: 1, totalSurface: 100, address: 'Casablanca', latitude: 0, longitude: 0, folderFees: 0, commissionPerM2: 0, status: 'done', progress: 100 },
    prixTotal: 550000,
  };
  
  // Dummy payments
  const dummyPayments: Payment[] = [
    {
      id: 1,
      amount: 100000,
      dueDate: new Date('2024-01-01'),
      status: 'PAID',
      proofOfPayment: null,
      property: dummyProperty,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      isFirstPayment: true,
      percentageOfTotal: 18.2,
    },
    {
      id: 2,
      amount: 175000,
      dueDate: new Date('2024-03-01'),
      status: 'PAID',
      proofOfPayment: null,
      property: dummyProperty,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01'),
      percentageOfTotal: 31.8,
    },
    {
      id: 3,
      amount: 100000,
      dueDate: new Date('2024-05-01'),
      status: 'LATE',
      proofOfPayment: null,
      property: dummyProperty,
      createdAt: new Date('2024-05-01'),
      updatedAt: new Date('2024-05-01'),
      percentageOfTotal: 18.2,
    },
    {
      id: 4,
      amount: 100000,
      dueDate: new Date('2024-07-01'),
      status: 'PENDING',
      proofOfPayment: null,
      property: dummyProperty,
      createdAt: new Date('2024-07-01'),
      updatedAt: new Date('2024-07-01'),
      percentageOfTotal: 18.2,
    },
    {
      id: 5,
      amount: 75000,
      dueDate: new Date('2024-09-01'),
      status: 'PENDING',
      proofOfPayment: null,
      property: dummyProperty,
      createdAt: new Date('2024-09-01'),
      updatedAt: new Date('2024-09-01'),
      percentageOfTotal: 13.6,
    },
  ];
  
  // Dummy client
  export const dummyClient: Client = {
    id: 1,
    name: 'Yubie El Amrani',
    firstName: 'Yubie',
    lastName: 'El Amrani',
    email: 'yubie@example.com',
    phoneNumber: '+212600000000',
    whatsappNumber: '+212600000000',
    notes: 'Client VIP',
    provenance: 'Site web',
    status: 'CLIENT',
    createdById: 1,
    apartments: [dummyProperty],
    interestedApartments: [],
    payments: dummyPayments,
    identityType: 'Carte d\'identité',
    identityNumber: 'AB123456',
    identityRecto: '',
    identityVerso: '',
  };