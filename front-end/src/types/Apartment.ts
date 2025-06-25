export interface Apartment {
    id: number;
    number: number;
    floor: number;
    type: "APARTMENT" | "DUPLEX" | "VILLA" | "STORE" | "LAND";
    area: number;
    threeDViewUrl?: string | null;
    price: number;
    pricePerM2: number;
    zone: string;
    image?: string | null;
    status: "AVAILABLE" | "RESERVED" | "SOLD";
    notes?: string | null;
    projectId: string;
    clientId?: string | null; // Changed from Client to clientId for consistency
    userId?: string;
    updatedAt: string;
}
