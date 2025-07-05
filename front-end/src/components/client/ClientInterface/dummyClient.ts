import { Property } from "@/types/property";
import { Payment } from "@/types/Payment";
import { Client } from "@/types/client";

// Dummy projects
const projectAtlas = { 
  id: 1, 
  name: 'Projet Atlas', 
  numberOfApartments: 50, 
  totalSurface: 5000, 
  address: 'Casablanca, Quartier Maarif', 
  latitude: 33.5731, 
  longitude: -7.5898, 
  folderFees: 15000, 
  status: 'done' as const, 
  progress: 100 
};

const projectOcean = { 
  id: 2, 
  name: 'Résidence Ocean View', 
  numberOfApartments: 80, 
  totalSurface: 8000, 
  address: 'Mohammedia, Corniche', 
  latitude: 33.6861, 
  longitude: -7.3829, 
  folderFees: 20000, 
  status: 'construction' as const, 
  progress: 75 
};

const projectBusiness = { 
  id: 3, 
  name: 'Business Plaza', 
  numberOfApartments: 30, 
  totalSurface: 3000, 
  address: 'Rabat, Agdal', 
  latitude: 34.0209, 
  longitude: -6.8416, 
  folderFees: 25000, 
  status: 'planification' as const, 
  progress: 25 
};

const projectGarden = { 
  id: 4, 
  name: 'Garden Residence', 
  numberOfApartments: 120, 
  totalSurface: 15000, 
  address: 'Marrakech, Palmeraie', 
  latitude: 31.6295, 
  longitude: -7.9811, 
  folderFees: 18000, 
  status: 'construction' as const, 
  progress: 60 
};

const projectLuxury = { 
  id: 5, 
  name: 'Luxury Towers', 
  numberOfApartments: 200, 
  totalSurface: 25000, 
  address: 'Casablanca, Anfa', 
  latitude: 33.5952, 
  longitude: -7.6324, 
  folderFees: 30000, 
  status: 'planification' as const, 
  progress: 15 
};

// Dummy properties
const dummyProperty: Property = {
    id: 1,
    number: 'A-101',
    type: 'APARTMENT',
    status: 'SOLD',
    floor: 1,
    habitable: 40,
    balcon: 5,
    terrasse: 5,
    piscine: 0,
    prixM2: 13750,
    prixType: 'M2',
    project: projectAtlas,
    prixTotal: 550000,
};

const dummyProperty2: Property = {
    id: 2,
    number: 'A-102',
    type: 'APARTMENT',
    status: 'RESERVED',
    floor: 1,
    habitable: 55,
    balcon: 8,
    terrasse: 13,
    piscine: 0,
    prixM2: 14000,
    prixType: 'M2',
    project: projectAtlas,
    prixTotal: 770000,
    parkingDisponible: true,
    parkingInclus: true,
    prixParking: 200000,
};

const dummyProperty3: Property = {
    id: 3,
    number: 'A-201',
    type: 'APARTMENT',
    status: 'RESERVED',
    floor: 2,
    habitable: 65,
    balcon: 10,
    terrasse: 0,
    piscine: 0,
    prixM2: 14500,
    prixType: 'M2',
    project: projectAtlas,
    prixTotal: 942500,
};

const dummyProperty4: Property = {
    id: 4,
    number: 'A-301',
    type: 'APARTMENT',
    status: 'RESERVED',
    floor: 3,
    habitable: 75,
    balcon: 12,
    terrasse: 0,
    piscine: 0,
    prixM2: 15000,
    prixType: 'M2',
    project: projectAtlas,
    prixTotal: 1125000,
};

const dummyProperty5: Property = {
    id: 5,
    number: 'A-401',
    type: 'APARTMENT',
    status: 'SOLD',
    floor: 4,
    habitable: 85,
    balcon: 15,
    terrasse: 0,
    piscine: 0,
    prixM2: 15500,
    prixType: 'M2',
    project: projectAtlas,
    prixTotal: 1317500,
};

const dummyProperty6: Property = {
    id: 6,
    number: 'V-001',
    type: 'VILLA',
    status: 'RESERVED',
    floor: 0,
    habitable: 120,
    balcon: 0,
    terrasse: 40,
    piscine: 30,
    prixM2: 18000,
    prixType: 'M2',
    project: projectOcean,
    prixTotal: 2160000,
    parkingDisponible: true,
    parkingInclus: true,
    prixParking: 200000,
};

const dummyProperty7: Property = {
    id: 7,
    number: 'V-002',
    type: 'VILLA',
    status: 'RESERVED',
    floor: 0,
    habitable: 150,
    balcon: 0,
    terrasse: 50,
    piscine: 40,
    prixM2: 19000,
    prixType: 'M2',
    project: projectOcean,
    prixTotal: 2850000,
    parkingDisponible: true,
    parkingInclus: true,
    prixParking: 250000,
};

const dummyProperty8: Property = {
    id: 8,
    number: 'V-003',
    type: 'VILLA',
    status: 'SOLD',
    floor: 0,
    habitable: 200,
    balcon: 0,
    terrasse: 60,
    piscine: 50,
    prixM2: 20000,
    prixType: 'M2',
    project: projectOcean,
    prixTotal: 4000000,
    parkingDisponible: true,
    parkingInclus: false,
    prixParking: 10000,
};

const dummyProperty9: Property = {
    id: 9,
    number: 'D-001',
    type: 'DUPLEX',
    status: 'RESERVED',
    floor: 1,
    habitable: 100,
    balcon: 15,
    terrasse: 20,
    piscine: 0,
    prixM2: 16000,
    prixType: 'M2',
    project: projectGarden,
    prixTotal: 1600000,
};

const dummyProperty10: Property = {
    id: 10,
    number: 'D-002',
    type: 'DUPLEX',
    status: 'RESERVED',
    floor: 2,
    habitable: 120,
    balcon: 18,
    terrasse: 25,
    piscine: 0,
    prixM2: 16500,
    prixType: 'M2',
    project: projectGarden,
    prixTotal: 1980000,
};

const dummyProperty11: Property = {
    id: 11,
    number: 'S-001',
    type: 'STORE',
    status: 'RESERVED',
    floor: 1,
    totalArea: 150,
    mezzanineArea: 50,
    mezzaninePrice: 500000,
    prixM2: 12000,
    prixType: 'M2',
    project: projectBusiness,
    prixTotal: 1800000,
};

const dummyProperty12: Property = {
    id: 12,
    number: 'S-002',
    type: 'STORE',
    status: 'SOLD',
    floor: 1,
    totalArea: 200,
    mezzanineArea: 80,
    mezzaninePrice: 800000,
    prixM2: 13000,
    prixType: 'M2',
    project: projectBusiness,
    prixTotal: 2600000,
};

const dummyProperty13: Property = {
    id: 13,
    number: 'S-003',
    type: 'STORE',
    status: 'RESERVED',
    floor: 2,
    totalArea: 100,
    mezzanineArea: 30,
    mezzaninePrice: 300000,
    prixM2: 11000,
    prixType: 'M2',
    project: projectBusiness,
    prixTotal: 1100000,
};

const dummyProperty14: Property = {
    id: 14,
    number: 'L-001',
    type: 'LAND',
    status: 'RESERVED',
    totalArea: 500,
    prixType: 'FIXE',
    project: projectGarden,
    prixTotal: 2500000,
};

const dummyProperty15: Property = {
    id: 15,
    number: 'L-002',
    type: 'LAND',
    status: 'SOLD',
    totalArea: 800,
    prixType: 'FIXE',
    project: projectGarden,
    prixTotal: 4000000,
};

const dummyProperty16: Property = {
    id: 16,
    number: 'L-003',
    type: 'LAND',
    status: 'RESERVED',
    totalArea: 300,
    prixType: 'FIXE',
    project: projectGarden,
    prixTotal: 1500000,
};

const dummyProperty17: Property = {
    id: 17,
    number: 'A-501',
    type: 'APARTMENT',
    status: 'RESERVED',
    floor: 5,
    habitable: 95,
    balcon: 18,
    terrasse: 0,
    piscine: 0,
    prixM2: 16000,
    prixType: 'M2',
    project: projectLuxury,
    prixTotal: 1520000,
};

const dummyProperty18: Property = {
    id: 18,
    number: 'A-502',
    type: 'APARTMENT',
    status: 'RESERVED',
    floor: 5,
    habitable: 110,
    balcon: 20,
    terrasse: 0,
    piscine: 0,
    prixM2: 16500,
    prixType: 'M2',
    project: projectLuxury,
    prixTotal: 1815000,
};

const dummyProperty19: Property = {
    id: 19,
    number: 'A-601',
    type: 'APARTMENT',
    status: 'RESERVED',
    floor: 6,
    habitable: 125,
    balcon: 25,
    terrasse: 0,
    piscine: 0,
    prixM2: 17000,
    prixType: 'M2',
    project: projectLuxury,
    prixTotal: 2125000,
};

const dummyProperty20: Property = {
    id: 20,
    number: 'A-602',
    type: 'APARTMENT',
    status: 'RESERVED',
    floor: 6,
    habitable: 140,
    balcon: 30,
    terrasse: 0,
    piscine: 0,
    prixM2: 17500,
    prixType: 'M2',
    project: projectLuxury,
    prixTotal: 2450000,
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
    apartments: [dummyProperty, dummyProperty2, dummyProperty3, dummyProperty4, dummyProperty5, dummyProperty6, dummyProperty7, dummyProperty8, dummyProperty9, dummyProperty10, dummyProperty11, dummyProperty12, dummyProperty13, dummyProperty14, dummyProperty15, dummyProperty16, dummyProperty17, dummyProperty18, dummyProperty19, dummyProperty20],
    interestedApartments: [],
    payments: dummyPayments,
    identityType: 'Carte d\'identité',
    identityNumber: 'AB123456',
    identityRecto: '',
    identityVerso: '',
};

// Export all properties
export const allDummyProperties = [
    dummyProperty, dummyProperty2, dummyProperty3, dummyProperty4, dummyProperty5,
    dummyProperty6, dummyProperty7, dummyProperty8, dummyProperty9, dummyProperty10,
    dummyProperty11, dummyProperty12, dummyProperty13, dummyProperty14, dummyProperty15,
    dummyProperty16, dummyProperty17, dummyProperty18, dummyProperty19, dummyProperty20
];

// Export all projects
export const allDummyProjects = [projectAtlas, projectOcean, projectBusiness, projectGarden, projectLuxury];