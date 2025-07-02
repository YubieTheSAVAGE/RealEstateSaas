// Enhanced Property Type Configuration System
export type PropertyType = 
  | "APARTMENT" | "DUPLEX" | "VILLA" | "PENTHOUSE" | "STUDIO" | "LOFT" | "TOWNHOUSE"
  | "STORE" | "OFFICE" | "WAREHOUSE" 
  | "LAND"
  | "GARAGE" | "PARKING";

export type PropertyCategory = "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "PARKING";

export interface PropertyFieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "checkbox" | "textarea";
  required: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: (value: any) => string | null;
  dependsOn?: string; // Field only shows if another field has specific value
  dependsOnValue?: any;
}

export interface PropertyTypeConfig {
  category: PropertyCategory;
  label: string;
  icon: string;
  description: string;
  requiresFloor: boolean;
  requiresZone: boolean;
  fields: PropertyFieldConfig[];
  pricingFields: PropertyFieldConfig[];
  features: string[];
}

// Validation functions
const validatePositiveNumber = (value: string) => {
  const num = Number(value);
  return !value || isNaN(num) || num <= 0 ? "Doit être un nombre positif" : null;
};

const validateNonNegativeNumber = (value: string) => {
  const num = Number(value);
  return value && (isNaN(num) || num < 0) ? "Doit être un nombre positif ou zéro" : null;
};

const validatePercentage = (value: string) => {
  const num = Number(value);
  return value && (isNaN(num) || num < 0 || num > 100) ? "Doit être entre 0 et 100%" : null;
};

// Property Type Configurations
export const PROPERTY_TYPES: Record<PropertyType, PropertyTypeConfig> = {
  // RESIDENTIAL PROPERTIES
  APARTMENT: {
    category: "RESIDENTIAL",
    label: "Appartement",
    icon: "🏠",
    description: "Unité résidentielle dans un immeuble",
    requiresFloor: true,
    requiresZone: true,
    fields: [
      { name: "habitable", label: "Surface habitable (m²)", type: "number", required: true, placeholder: "ex: 100", validation: validatePositiveNumber },
      { name: "bedrooms", label: "Nombre de chambres", type: "number", required: false, placeholder: "ex: 3" },
      { name: "bathrooms", label: "Nombre de salles de bain", type: "number", required: false, placeholder: "ex: 2" },
      { name: "balcon", label: "Surface balcon (m²)", type: "number", required: false, placeholder: "ex: 10", validation: validateNonNegativeNumber },
      { name: "terrasse", label: "Surface terrasse (m²)", type: "number", required: false, placeholder: "ex: 20", validation: validateNonNegativeNumber },
      { name: "orientation", label: "Orientation", type: "select", required: false, options: [
        { value: "NORTH", label: "Nord" },
        { value: "SOUTH", label: "Sud" },
        { value: "EAST", label: "Est" },
        { value: "WEST", label: "Ouest" },
        { value: "NORTH_EAST", label: "Nord-Est" },
        { value: "SOUTH_WEST", label: "Sud-Ouest" }
      ]},
      { name: "hasElevator", label: "Ascenseur", type: "checkbox", required: false },
      { name: "furnished", label: "Meublé", type: "checkbox", required: false }
    ],
    pricingFields: [
      { name: "prixBalconPct", label: "% Prix balcon", type: "number", required: false, placeholder: "ex: 50", validation: validatePercentage },
      { name: "prixTerrassePct", label: "% Prix terrasse", type: "number", required: false, placeholder: "ex: 70", validation: validatePercentage }
    ],
    features: ["parking", "storage"]
  },

  VILLA: {
    category: "RESIDENTIAL",
    label: "Villa",
    icon: "🏡",
    description: "Maison individuelle avec jardin",
    requiresFloor: false,
    requiresZone: true,
    fields: [
      { name: "habitable", label: "Surface habitable (m²)", type: "number", required: true, placeholder: "ex: 200", validation: validatePositiveNumber },
      { name: "bedrooms", label: "Nombre de chambres", type: "number", required: false, placeholder: "ex: 4" },
      { name: "bathrooms", label: "Nombre de salles de bain", type: "number", required: false, placeholder: "ex: 3" },
      { name: "jardin", label: "Surface jardin (m²)", type: "number", required: false, placeholder: "ex: 500", validation: validateNonNegativeNumber },
      { name: "terrasse", label: "Surface terrasse (m²)", type: "number", required: false, placeholder: "ex: 50", validation: validateNonNegativeNumber },
      { name: "piscine", label: "Surface piscine (m²)", type: "number", required: false, placeholder: "ex: 40", validation: validateNonNegativeNumber },
      { name: "garage", label: "Nombre de places garage", type: "number", required: false, placeholder: "ex: 2" },
      { name: "hasGarden", label: "Jardin", type: "checkbox", required: false },
      { name: "hasPool", label: "Piscine", type: "checkbox", required: false }
    ],
    pricingFields: [
      { name: "prixJardinPct", label: "% Prix jardin", type: "number", required: false, placeholder: "ex: 30", validation: validatePercentage },
      { name: "prixTerrassePct", label: "% Prix terrasse", type: "number", required: false, placeholder: "ex: 70", validation: validatePercentage },
      { name: "prixPiscine", label: "Prix piscine (DH/m²)", type: "number", required: false, placeholder: "ex: 5000" }
    ],
    features: ["parking", "garden", "pool"]
  },

  DUPLEX: {
    category: "RESIDENTIAL",
    label: "Duplex",
    icon: "🏘️",
    description: "Appartement sur deux niveaux",
    requiresFloor: true,
    requiresZone: true,
    fields: [
      { name: "habitable", label: "Surface habitable (m²)", type: "number", required: true, placeholder: "ex: 150", validation: validatePositiveNumber },
      { name: "bedrooms", label: "Nombre de chambres", type: "number", required: false, placeholder: "ex: 3" },
      { name: "bathrooms", label: "Nombre de salles de bain", type: "number", required: false, placeholder: "ex: 2" },
      { name: "balcon", label: "Surface balcon (m²)", type: "number", required: false, placeholder: "ex: 15", validation: validateNonNegativeNumber },
      { name: "terrasse", label: "Surface terrasse (m²)", type: "number", required: false, placeholder: "ex: 30", validation: validateNonNegativeNumber },
      { name: "mezzanine", label: "Surface mezzanine (m²)", type: "number", required: false, placeholder: "ex: 20", validation: validateNonNegativeNumber }
    ],
    pricingFields: [
      { name: "prixBalconPct", label: "% Prix balcon", type: "number", required: false, placeholder: "ex: 50", validation: validatePercentage },
      { name: "prixTerrassePct", label: "% Prix terrasse", type: "number", required: false, placeholder: "ex: 70", validation: validatePercentage }
    ],
    features: ["parking"]
  },

  // COMMERCIAL PROPERTIES
  STORE: {
    category: "COMMERCIAL",
    label: "Magasin",
    icon: "🏪",
    description: "Local commercial de vente",
    requiresFloor: true,
    requiresZone: true,
    fields: [
      { name: "totalArea", label: "Surface totale (m²)", type: "number", required: true, placeholder: "ex: 100", validation: validatePositiveNumber },
      { name: "mezzanineArea", label: "Surface mezzanine (m²)", type: "number", required: false, placeholder: "ex: 30", validation: validateNonNegativeNumber },
      { name: "storageArea", label: "Surface stockage (m²)", type: "number", required: false, placeholder: "ex: 20", validation: validateNonNegativeNumber },
      { name: "storefront", label: "Vitrine", type: "checkbox", required: false },
      { name: "airConditioning", label: "Climatisation", type: "checkbox", required: false },
      { name: "securitySystem", label: "Système de sécurité", type: "checkbox", required: false }
    ],
    pricingFields: [
      { name: "mezzaninePrice", label: "Prix mezzanine (DH/m²)", type: "number", required: false, placeholder: "ex: 8000" },
      { name: "storagePrice", label: "Prix stockage (DH/m²)", type: "number", required: false, placeholder: "ex: 5000" }
    ],
    features: ["security", "storage"]
  },

  OFFICE: {
    category: "COMMERCIAL",
    label: "Bureau",
    icon: "🏢",
    description: "Espace de travail professionnel",
    requiresFloor: true,
    requiresZone: true,
    fields: [
      { name: "totalArea", label: "Surface totale (m²)", type: "number", required: true, placeholder: "ex: 80", validation: validatePositiveNumber },
      { name: "officeRooms", label: "Nombre de bureaux", type: "number", required: false, placeholder: "ex: 4" },
      { name: "meetingRooms", label: "Salles de réunion", type: "number", required: false, placeholder: "ex: 1" },
      { name: "airConditioning", label: "Climatisation", type: "checkbox", required: false },
      { name: "internetFiber", label: "Fibre optique", type: "checkbox", required: false },
      { name: "securitySystem", label: "Système de sécurité", type: "checkbox", required: false }
    ],
    pricingFields: [],
    features: ["parking", "security", "internet"]
  },

  // LAND PROPERTIES
  LAND: {
    category: "LAND",
    label: "Terrain",
    icon: "🌍",
    description: "Terrain à bâtir ou agricole",
    requiresFloor: false,
    requiresZone: false,
    fields: [
      { name: "totalArea", label: "Surface totale (m²)", type: "number", required: true, placeholder: "ex: 1000", validation: validatePositiveNumber },
      { name: "buildableArea", label: "Surface constructible (m²)", type: "number", required: false, placeholder: "ex: 600", validation: validateNonNegativeNumber },
      { name: "landType", label: "Type de terrain", type: "select", required: false, options: [
        { value: "URBAN", label: "Urbain" },
        { value: "RURAL", label: "Rural" },
        { value: "INDUSTRIAL", label: "Industriel" },
        { value: "AGRICULTURAL", label: "Agricole" }
      ]},
      { name: "hasWater", label: "Accès eau", type: "checkbox", required: false },
      { name: "hasElectricity", label: "Accès électricité", type: "checkbox", required: false },
      { name: "buildingPermit", label: "Permis de construire", type: "checkbox", required: false }
    ],
    pricingFields: [],
    features: ["utilities", "permits"]
  },

  // PARKING PROPERTIES
  GARAGE: {
    category: "PARKING",
    label: "Garage",
    icon: "🚗",
    description: "Garage fermé pour véhicules",
    requiresFloor: false,
    requiresZone: true,
    fields: [
      { name: "totalArea", label: "Surface (m²)", type: "number", required: true, placeholder: "ex: 20", validation: validatePositiveNumber },
      { name: "vehicleCapacity", label: "Nombre de véhicules", type: "number", required: false, placeholder: "ex: 1" },
      { name: "hasElectricCharging", label: "Borne électrique", type: "checkbox", required: false },
      { name: "hasStorage", label: "Espace stockage", type: "checkbox", required: false },
      { name: "securityLevel", label: "Niveau sécurité", type: "select", required: false, options: [
        { value: "BASIC", label: "Basique" },
        { value: "GATED", label: "Portail" },
        { value: "SURVEILLANCE", label: "Surveillance" }
      ]}
    ],
    pricingFields: [],
    features: ["security", "storage"]
  },

  // Additional types with minimal config for now
  PENTHOUSE: { ...{} as PropertyTypeConfig }, // Will be expanded
  STUDIO: { ...{} as PropertyTypeConfig },
  LOFT: { ...{} as PropertyTypeConfig },
  TOWNHOUSE: { ...{} as PropertyTypeConfig },
  WAREHOUSE: { ...{} as PropertyTypeConfig },
  PARKING: { ...{} as PropertyTypeConfig }
};

// Helper functions
export const getPropertyTypeConfig = (type: PropertyType): PropertyTypeConfig => {
  return PROPERTY_TYPES[type];
};

export const getPropertyTypesByCategory = (category: PropertyCategory): PropertyType[] => {
  return Object.entries(PROPERTY_TYPES)
    .filter(([_, config]) => config.category === category)
    .map(([type, _]) => type as PropertyType);
};

export const getRequiredFields = (type: PropertyType): string[] => {
  const config = getPropertyTypeConfig(type);
  const baseRequired = ['number', 'type', 'status'];
  
  if (config.requiresFloor) baseRequired.push('floor');
  if (config.requiresZone) baseRequired.push('zone');
  
  const typeRequired = config.fields
    .filter(field => field.required)
    .map(field => field.name);
    
  return [...baseRequired, ...typeRequired];
};
