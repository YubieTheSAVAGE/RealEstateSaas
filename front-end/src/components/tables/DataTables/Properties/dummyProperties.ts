import { Property } from "@/types/property";
export const dummyProperties: Property[] = [
    // APARTMENT examples
    {
      id: 1,
      number: "A-301",
      type: "APARTMENT",
      status: "SOLD",
      floor: 3,
      zone: "Centre Ville",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      notes: "Appartement lumineux avec vue sur le parc.",
      project: {
        id: 1,
        name: "Résidence Les Palmiers",
        numberOfApartments: 120,
        totalSurface: 12000,
        address: "123 Rue des Palmiers",
        latitude: 33.5779,
        longitude: -7.5911,
        folderFees: 10000,
        status: "planification",
        progress: 0,
      },
      client: {
        id: 42,
        name: "Ahmed Benali",
        firstName: "Ahmed",
        lastName: "Benali",
        email: "ahmed@benali.com",
        phoneNumber: "0600000000",
        whatsappNumber: "0600000000",
        identityType: "Carte d'identité",
        identityNumber: "1234567890",
        identityRecto: "https://example.com/recto.jpg",
        identityVerso: "https://example.com/verso.jpg",
        provenance: "Maroc",
        status: "CLIENT",
        createdById: 7,
        payments: [],
      },
      userId: 7,
      interestedClients: [],
      updatedAt: "2024-06-01T12:00:00Z",
      habitable: 120,
      balcon: 15,
      terrasse: 25,
      piscine: 20,
      totalArea: undefined,
      mezzanineArea: undefined,
      mezzaninePrice: undefined,
      prixType: "FIXE",
      prixTotal: 12320000,
      prixM2: undefined,
      prixBalconPct: undefined,
      prixTerrassePct: undefined,
      prixPiscine: undefined,
      parkingDisponible: true,
      parkingInclus: true,
      prixParking: undefined,
    },
    {
      id: 2,
      number: "A-502",
      type: "APARTMENT",
      status: "AVAILABLE",
      floor: 5,
      zone: "Quartier des Affaires",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80",
      notes: "Appartement moderne avec terrasse panoramique.",
      project: {
        id: 2,
        name: "Tower Business Center",
        numberOfApartments: 80,
        totalSurface: 8000,
        address: "456 Avenue Mohammed V",
        latitude: 33.5731,
        longitude: -7.5898,
        folderFees: 15000,
        status: "construction",
        progress: 60,
      },
      client: null,
      userId: 7,
      interestedClients: [],
      updatedAt: "2024-06-02T10:30:00Z",
      habitable: 85,
      balcon: 8,
      terrasse: 20,
      piscine: 10,
      totalArea: undefined,
      mezzanineArea: undefined,
      mezzaninePrice: undefined,
      prixType: "M2",
      prixTotal: 12320000,
      prixM2: 15000,
      prixBalconPct: 50,
      prixTerrassePct: 75,
      prixPiscine: 120000,
      parkingDisponible: true,
      parkingInclus: false,
      prixParking: 500000,
    },
    {
      id: 3,
      number: "A-201",
      type: "APARTMENT",
      status: "SOLD",
      floor: 2,
      zone: "Zone Résidentielle",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
      notes: "Appartement familial avec jardin privatif.",
      project: {
        id: 3,
        name: "Les Jardins de l'Atlas",
        numberOfApartments: 200,
        totalSurface: 25000,
        address: "789 Boulevard Hassan II",
        latitude: 33.5952,
        longitude: -7.6324,
        folderFees: 8000,
        status: "done",
        progress: 100,
      },
      client: {
        id: 43,
        name: "Fatima Zahra",
        firstName: "Fatima",
        lastName: "Zahra",
        email: "fatima.zahra@email.com",
        phoneNumber: "0612345678",
        whatsappNumber: "0612345678",
        identityType: "Passport",
        identityNumber: "AB123456",
        identityRecto: "https://example.com/passport.jpg",
        identityVerso: "https://example.com/passport-back.jpg",
        provenance: "Maroc",
        status: "CLIENT",
        createdById: 7,
        payments: [],
      },
      userId: 7,
      interestedClients: [],
      updatedAt: "2024-05-15T14:20:00Z",
      habitable: 95,
      balcon: 12,
      terrasse: undefined,
      piscine: undefined,
      totalArea: undefined,
      mezzanineArea: undefined,
      mezzaninePrice: undefined,
      prixType: "FIXE",
      prixTotal: 9800000,
      prixM2: undefined,
      prixBalconPct: undefined,
      prixTerrassePct: undefined,
      prixPiscine: undefined,
      parkingDisponible: false,
      parkingInclus: false,
      prixParking: undefined,
    },
  
    // DUPLEX examples
    {
      id: 4,
      number: "D-101",
      type: "DUPLEX",
      status: "AVAILABLE",
      floor: 1,
      zone: "Quartier Premium",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
      notes: "Duplex de luxe avec escalier intérieur.",
      project: {
        id: 4,
        name: "Villa Royale Complex",
        numberOfApartments: 50,
        totalSurface: 15000,
        address: "321 Route de la Corniche",
        latitude: 33.6089,
        longitude: -7.6328,
        folderFees: 20000,
        status: "construction",
        progress: 40,
      },
      client: null,
      userId: 7,
      interestedClients: [],
      updatedAt: "2024-06-03T09:15:00Z",
      habitable: 180,
      balcon: 20,
      terrasse: 40,
      piscine: undefined,
      totalArea: undefined,
      mezzanineArea: undefined,
      mezzaninePrice: undefined,
      prixType: "FIXE",
      prixTotal: 25000000,
      prixM2: undefined,
      prixBalconPct: undefined,
      prixTerrassePct: undefined,
      prixPiscine: undefined,
      parkingDisponible: true,
      parkingInclus: true,
      prixParking: undefined,
    },
    {
      id: 5,
      number: "D-202",
      type: "DUPLEX",
      status: "RESERVED",
      floor: 2,
      zone: "Zone Côtière",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
      notes: "Duplex avec vue mer et terrasse privée.",
      project: {
        id: 5,
        name: "Marina Bay Residence",
        numberOfApartments: 75,
        totalSurface: 18000,
        address: "654 Corniche Ain Diab",
        latitude: 33.5917,
        longitude: -7.6324,
        folderFees: 25000,
        status: "planification",
        progress: 20,
      },
      client: {
        id: 44,
        name: "Karim Alami",
        firstName: "Karim",
        lastName: "Alami",
        email: "karim.alami@email.com",
        phoneNumber: "0623456789",
        whatsappNumber: "0623456789",
        identityType: "Carte d'identité",
        identityNumber: "CD987654",
        identityRecto: "https://example.com/cni-front.jpg",
        identityVerso: "https://example.com/cni-back.jpg",
        provenance: "Maroc",
        status: "CLIENT",
        createdById: 7,
        payments: [],
      },
      userId: 7,
      interestedClients: [],
      updatedAt: "2024-06-01T16:45:00Z",
      habitable: 220,
      balcon: 25,
      terrasse: 60,
      piscine: undefined,
      totalArea: undefined,
      mezzanineArea: undefined,
      mezzaninePrice: undefined,
      prixType: "M2",
      prixTotal: 12320000,
      prixM2: 18000,
      prixBalconPct: 60,
      prixTerrassePct: 80,
      prixPiscine: undefined,
      parkingDisponible: true,
      parkingInclus: false,
      prixParking: 800000,
    },
  
    // VILLA examples
    {
      id: 6,
      number: "V-001",
      type: "VILLA",
      status: "AVAILABLE",
      floor: undefined,
      zone: "Quartier Huppé",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80",
      notes: "Villa de luxe avec piscine privée et jardin paysager.",
      project: {
        id: 6,
        name: "Palm Grove Villas",
        numberOfApartments: 25,
        totalSurface: 50000,
        address: "987 Route de l'Université",
        latitude: 33.5731,
        longitude: -7.6324,
        folderFees: 50000,
        status: "construction",
        progress: 70,
      },
      client: null,
      userId: 7,
      interestedClients: [],
      updatedAt: "2024-06-04T11:20:00Z",
      habitable: 350,
      balcon: undefined,
      terrasse: 80,
      piscine: 25,
      totalArea: undefined,
      mezzanineArea: undefined,
      mezzaninePrice: undefined,
      prixType: "FIXE",
      prixTotal: 45000000,
      prixM2: undefined,
      prixBalconPct: undefined,
      prixTerrassePct: undefined,
      prixPiscine: 5000,
      parkingDisponible: true,
      parkingInclus: true,
      prixParking: undefined,
    },
    {
      id: 7,
      number: "V-002",
      type: "VILLA",
      status: "SOLD",
      floor: undefined,
      zone: "Zone Résidentielle Exclusive",
      image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=600&q=80",
      notes: "Villa moderne avec architecture contemporaine.",
      project: {
        id: 7,
        name: "Modern Living Estates",
        numberOfApartments: 15,
        totalSurface: 30000,
        address: "147 Avenue des Nations Unies",
        latitude: 33.5952,
        longitude: -7.6324,
        folderFees: 60000,
        status: "done",
        progress: 100,
      },
      client: {
        id: 45,
        name: "Sara Bennani",
        firstName: "Sara",
        lastName: "Bennani",
        email: "sara.bennani@email.com",
        phoneNumber: "0634567890",
        whatsappNumber: "0634567890",
        identityType: "Passport",
        identityNumber: "EF567890",
        identityRecto: "https://example.com/passport-front.jpg",
        identityVerso: "https://example.com/passport-back.jpg",
        provenance: "Maroc",
        status: "CLIENT",
        createdById: 7,
        payments: [],
      },
      userId: 7,
      interestedClients: [],
      updatedAt: "2024-05-20T13:10:00Z",
      habitable: 280,
      balcon: undefined,
      terrasse: 60,
      piscine: 20,
      totalArea: undefined,
      mezzanineArea: undefined,
      mezzaninePrice: undefined,
      prixType: "M2",
      prixTotal: 12320000,
      prixM2: 20000,
      prixBalconPct: undefined,
      prixTerrassePct: 70,
      prixPiscine: 4000,
      parkingDisponible: true,
      parkingInclus: true,
      prixParking: undefined,
    },
  
    // STORE examples
    {
      id: 8,
      number: "S-001",
      type: "STORE",
      status: "AVAILABLE",
      floor: 0,
      zone: "Zone Commerciale",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
      notes: "Local commercial idéal pour boutique ou restaurant.",
      project: {
        id: 8,
        name: "Shopping Center Central",
        numberOfApartments: 40,
        totalSurface: 8000,
        address: "258 Boulevard Mohammed V",
        latitude: 33.5731,
        longitude: -7.5898,
        folderFees: 12000,
        status: "done",
        progress: 85,
      },
      client: null,
      userId: 7,
      interestedClients: [],
      updatedAt: "2024-06-05T08:30:00Z",
      habitable: undefined,
      balcon: undefined,
      terrasse: undefined,
      piscine: undefined,
      totalArea: 150,
      mezzanineArea: 30,
      mezzaninePrice: 2000000,
      prixType: "FIXE",
      prixTotal: 18000000,
      prixM2: undefined,
      prixBalconPct: undefined,
      prixTerrassePct: undefined,
      prixPiscine: undefined,
      parkingDisponible: true,
      parkingInclus: false,
      prixParking: 300000,
    },
    {
      id: 9,
      number: "S-002",
      type: "STORE",
      status: "RESERVED",
      floor: 1,
      zone: "Quartier des Affaires",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
      notes: "Bureau commercial avec mezzanine aménageable.",
      project: {
        id: 9,
        name: "Business Plaza",
        numberOfApartments: 60,
        totalSurface: 12000,
        address: "369 Avenue Hassan II",
        latitude: 33.5952,
        longitude: -7.6324,
        folderFees: 15000,
        status: "planification",
        progress: 30,
      },
      client: {
        id: 46,
        name: "Mohammed Tazi",
        firstName: "Mohammed",
        lastName: "Tazi",
        email: "mohammed.tazi@email.com",
        phoneNumber: "0645678901",
        whatsappNumber: "0645678901",
        identityType: "Carte d'identité",
        identityNumber: "GH678901",
        identityRecto: "https://example.com/cni-front.jpg",
        identityVerso: "https://example.com/cni-back.jpg",
        provenance: "Maroc",
        status: "CLIENT",
        createdById: 7,
        payments: [],
      },
      userId: 7,
      interestedClients: [],
      updatedAt: "2024-06-02T15:45:00Z",
      habitable: undefined,
      balcon: undefined,
      terrasse: undefined,
      piscine: undefined,
      totalArea: 200,
      mezzanineArea: 50,
      mezzaninePrice: 3000000,
      prixType: "M2",
      prixTotal: 12320000,
      prixM2: 12000,
      prixBalconPct: undefined,
      prixTerrassePct: undefined,
      prixPiscine: undefined,
      parkingDisponible: false,
      parkingInclus: false,
      prixParking: undefined,
    },
  
    // LAND examples
    {
      id: 10,
      number: "L-001",
      type: "LAND",
      status: "AVAILABLE",
      floor: undefined,
      zone: "Zone de Développement",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
      notes: "Terrain constructible avec permis de construire.",
      project: {
        id: 10,
        name: "Green Valley Development",
        numberOfApartments: 100,
        totalSurface: 100000,
        address: "741 Route de l'Aéroport",
        latitude: 33.5731,
        longitude: -7.5898,
        folderFees: 5000,
        status: "planification",
        progress: 10,
      },
      client: null,
      userId: 7,
      interestedClients: [],
      updatedAt: "2024-06-06T12:00:00Z",
      habitable: undefined,
      balcon: undefined,
      terrasse: undefined,
      piscine: undefined,
      totalArea: 500,
      mezzanineArea: undefined,
      mezzaninePrice: undefined,
      prixType: "M2",
      prixTotal: 12320000,
      prixM2: 8000,
      prixBalconPct: undefined,
      prixTerrassePct: undefined,
      prixPiscine: undefined,
      parkingDisponible: undefined,
      parkingInclus: undefined,
      prixParking: undefined,
    },
    {
      id: 11,
      number: "L-002",
      type: "LAND",
      status: "SOLD",
      floor: undefined,
      zone: "Zone Agricole",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
      notes: "Terrain agricole avec source d'eau naturelle.",
      project: {
        id: 11,
        name: "Agricultural Lands Project",
        numberOfApartments: 50,
        totalSurface: 200000,
        address: "852 Route de la Campagne",
        latitude: 33.5952,
        longitude: -7.6324,
        folderFees: 3000,   
        status: "done",
        progress: 100,
      },
      client: {
        id: 47,
        name: "Hassan El Fassi",
        firstName: "Hassan",
        lastName: "El Fassi",
        email: "hassan.elfassi@email.com",
        phoneNumber: "0656789012",
        whatsappNumber: "0656789012",
        identityType: "Carte d'identité",
        identityNumber: "IJ789012",
        identityRecto: "https://example.com/cni-front.jpg",
        identityVerso: "https://example.com/cni-back.jpg",
        provenance: "Maroc",
        status: "CLIENT",
        createdById: 7,
        payments: [],
      },
      userId: 7,
      interestedClients: [],
      updatedAt: "2024-05-25T09:30:00Z",
      habitable: undefined,
      balcon: undefined,
      terrasse: undefined,
      piscine: undefined,
      totalArea: 1000,
      mezzanineArea: undefined,
      mezzaninePrice: undefined,
      prixType: "FIXE",
      prixTotal: 15000000,
      prixM2: undefined,
      prixBalconPct: undefined,
      prixTerrassePct: undefined,
      prixPiscine: undefined,
      parkingDisponible: undefined,
      parkingInclus: undefined,
      prixParking: undefined,
    }
  ];
  