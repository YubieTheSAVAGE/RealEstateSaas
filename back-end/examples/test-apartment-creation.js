/**
 * Test script for apartment creation with enhanced fields
 * Run with: node test-apartment-creation.js
 */

const FormData = require('form-data');
const fs = require('fs');

// Example apartment payload for testing
const apartmentPayload = {
  // Required fields
  number: "A101",
  type: "APARTMENT", 
  price: "850000",
  prixType: "M2",
  
  // Conditional required fields
  floor: "3",
  zone: "Zone A",
  
  // Status and basic info
  status: "AVAILABLE",
  notes: "Appartement moderne avec vue sur mer",
  threeDViewUrl: "https://example.com/3d-view/a101",
  
  // Pricing fields
  pricePerM2: "12000",
  commissionPerM2: "500",
  
  // Surface measurements for residential properties
  habitable: "85.5",
  balcon: "12.0", 
  terrasse: "15.0",
  piscine: "0",
  
  // Percentage-based pricing for annexes
  prixBalconPct: "50",
  prixTerrassePct: "30", 
  prixPiscine: "0",
  
  // Parking configuration
  parkingDisponible: "true",
  parkingInclus: "false",
  prixParking: "80000"
};

// Villa payload example
const villaPayload = {
  number: "V001",
  floor: "2",
  type: "VILLA",
  status: "AVAILABLE", 
  zone: "Zone Premium",
  prixType: "FIXE",
  price: "2500000",
  habitable: "250.0",
  terrasse: "45.0",
  piscine: "25.0",
  commissionPerM2: "800",
  prixTerrassePct: "25",
  prixPiscine: "15000",
  parkingDisponible: "true",
  parkingInclus: "true",
  notes: "Villa de luxe avec piscine privée"
};

// Land payload example
const landPayload = {
  number: "T001",
  type: "LAND",
  status: "AVAILABLE",
  prixType: "M2", 
  price: "1200000",
  pricePerM2: "3000",
  totalArea: "400.0",
  commissionPerM2: "200",
  notes: "Terrain constructible avec vue panoramique"
};

// Store payload example
const storePayload = {
  number: "S001",
  floor: "0",
  type: "STORE",
  status: "AVAILABLE",
  prixType: "FIXE",
  price: "450000", 
  totalArea: "120.0",
  mezzanineArea: "30.0",
  mezzaninePrice: "75000",
  commissionPerM2: "300",
  notes: "Local commercial avec mezzanine"
};

/**
 * Create FormData from payload object
 */
function createFormData(payload) {
  const formData = new FormData();
  
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });
  
  return formData;
}

/**
 * Validate payload against required fields
 */
function validatePayload(payload, propertyType) {
  const errors = [];
  
  // Required fields for all properties
  const requiredFields = ['number', 'type', 'price', 'prixType'];
  
  requiredFields.forEach(field => {
    if (!payload[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // Conditional validations based on property type
  const typesWithFloor = [
    'APARTMENT', 'DUPLEX', 'VILLA', 'PENTHOUSE',
    'STUDIO', 'LOFT', 'TOWNHOUSE', 'OFFICE', 'WAREHOUSE'
  ];
  
  const typesWithZone = ['APARTMENT', 'DUPLEX', 'VILLA'];
  
  if (typesWithFloor.includes(propertyType) && !payload.floor) {
    errors.push(`Floor is required for ${propertyType} type`);
  }
  
  if (typesWithZone.includes(propertyType) && !payload.zone) {
    errors.push(`Zone is required for ${propertyType} type`);
  }
  
  // Validate pricing logic
  if (payload.prixType === 'M2' && !payload.pricePerM2) {
    errors.push('pricePerM2 is required when prixType is M2');
  }
  
  // Validate percentage fields
  ['prixBalconPct', 'prixTerrassePct'].forEach(field => {
    if (payload[field]) {
      const value = parseFloat(payload[field]);
      if (value < 0 || value > 100) {
        errors.push(`${field} must be between 0 and 100`);
      }
    }
  });
  
  return errors;
}

/**
 * Test all payload examples
 */
function testPayloads() {
  console.log('🧪 Testing Property Creation Payloads\n');
  
  const testCases = [
    { name: 'Apartment', payload: apartmentPayload },
    { name: 'Villa', payload: villaPayload },
    { name: 'Land', payload: landPayload },
    { name: 'Store', payload: storePayload }
  ];
  
  testCases.forEach(({ name, payload }) => {
    console.log(`📋 Testing ${name} payload:`);
    
    const errors = validatePayload(payload, payload.type);
    
    if (errors.length === 0) {
      console.log(`✅ ${name} payload is valid`);
      console.log(`📊 Fields count: ${Object.keys(payload).length}`);
    } else {
      console.log(`❌ ${name} payload has errors:`);
      errors.forEach(error => console.log(`   - ${error}`));
    }
    
    console.log('');
  });
  
  console.log('🎯 All payloads tested successfully!');
}

// Run tests if script is executed directly
if (require.main === module) {
  testPayloads();
}

module.exports = {
  apartmentPayload,
  villaPayload, 
  landPayload,
  storePayload,
  createFormData,
  validatePayload
};
