# Property Creation Payload Examples

## 1. Apartment Example (Complete with all fields)

### POST `/api/projects/1/apartments`
**Content-Type:** `multipart/form-data`

```bash
curl -X POST "http://localhost:3001/api/projects/1/apartments" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "number=A101" \
  -F "floor=3" \
  -F "type=APARTMENT" \
  -F "status=AVAILABLE" \
  -F "zone=Zone A" \
  -F "prixType=M2" \
  -F "price=850000" \
  -F "pricePerM2=12000" \
  -F "habitable=85.5" \
  -F "balcon=12.0" \
  -F "terrasse=15.0" \
  -F "piscine=0" \
  -F "commissionPerM2=500" \
  -F "prixBalconPct=50" \
  -F "prixTerrassePct=30" \
  -F "prixPiscine=0" \
  -F "parkingDisponible=true" \
  -F "parkingInclus=false" \
  -F "prixParking=80000" \
  -F "notes=Appartement moderne avec vue sur mer" \
  -F "threeDViewUrl=https://example.com/3d-view/a101" \
  -F "image=@apartment-a101.jpg"
```

### JSON Equivalent (for reference)
```json
{
  "number": "A101",
  "floor": 3,
  "type": "APARTMENT",
  "status": "AVAILABLE",
  "zone": "Zone A",
  "prixType": "M2",
  "price": 850000,
  "pricePerM2": 12000,
  "habitable": 85.5,
  "balcon": 12.0,
  "terrasse": 15.0,
  "piscine": 0,
  "commissionPerM2": 500,
  "prixBalconPct": 50,
  "prixTerrassePct": 30,
  "prixPiscine": 0,
  "parkingDisponible": true,
  "parkingInclus": false,
  "prixParking": 80000,
  "notes": "Appartement moderne avec vue sur mer",
  "threeDViewUrl": "https://example.com/3d-view/a101"
}
```

## 2. Villa Example

### POST `/api/projects/1/apartments`
```bash
curl -X POST "http://localhost:3001/api/projects/1/apartments" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "number=V001" \
  -F "floor=2" \
  -F "type=VILLA" \
  -F "status=AVAILABLE" \
  -F "zone=Zone Premium" \
  -F "prixType=FIXE" \
  -F "price=2500000" \
  -F "habitable=250.0" \
  -F "balcon=0" \
  -F "terrasse=45.0" \
  -F "piscine=25.0" \
  -F "commissionPerM2=800" \
  -F "prixTerrassePct=25" \
  -F "prixPiscine=15000" \
  -F "parkingDisponible=true" \
  -F "parkingInclus=true" \
  -F "notes=Villa de luxe avec piscine privée" \
  -F "image=@villa-v001.jpg"
```

## 3. Land Example

### POST `/api/projects/1/apartments`
```bash
curl -X POST "http://localhost:3001/api/projects/1/apartments" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "number=T001" \
  -F "type=LAND" \
  -F "status=AVAILABLE" \
  -F "prixType=M2" \
  -F "price=1200000" \
  -F "pricePerM2=3000" \
  -F "totalArea=400.0" \
  -F "commissionPerM2=200" \
  -F "notes=Terrain constructible avec vue panoramique" \
  -F "image=@land-t001.jpg"
```

## 4. Store Example

### POST `/api/projects/1/apartments`
```bash
curl -X POST "http://localhost:3001/api/projects/1/apartments" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "number=S001" \
  -F "floor=0" \
  -F "type=STORE" \
  -F "status=AVAILABLE" \
  -F "prixType=FIXE" \
  -F "price=450000" \
  -F "totalArea=120.0" \
  -F "mezzanineArea=30.0" \
  -F "mezzaninePrice=75000" \
  -F "commissionPerM2=300" \
  -F "notes=Local commercial avec mezzanine" \
  -F "image=@store-s001.jpg"
```

## 5. Minimal Apartment Example (Required fields only)

### POST `/api/projects/1/apartments`
```bash
curl -X POST "http://localhost:3001/api/projects/1/apartments" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "number=A102" \
  -F "type=APARTMENT" \
  -F "price=650000" \
  -F "prixType=FIXE"
```

## Field Descriptions

### Required Fields
- `number`: Property identifier (string)
- `type`: Property type (enum)
- `price`: Total price (number)
- `prixType`: Price type - "FIXE" or "M2" (enum)

### Conditional Fields
- `floor`: Required for multi-story properties (not LAND, GARAGE, PARKING)
- `zone`: Required for APARTMENT, DUPLEX, VILLA
- `habitable`: Required when prixType="M2" for residential properties

### Surface Fields (for APARTMENT, DUPLEX, VILLA)
- `habitable`: Habitable surface in m²
- `balcon`: Balcony surface in m²
- `terrasse`: Terrace surface in m²
- `piscine`: Pool surface in m²

### Land/Store Fields
- `totalArea`: Total area for LAND and STORE types
- `mezzanineArea`: Mezzanine area for STORE type
- `mezzaninePrice`: Mezzanine price for STORE type

### Pricing Fields
- `pricePerM2`: Price per m² (when prixType="M2")
- `commissionPerM2`: Commission per m²
- `prixBalconPct`: Balcony price percentage (0-100)
- `prixTerrassePct`: Terrace price percentage (0-100)
- `prixPiscine`: Pool price per m²

### Parking Fields
- `parkingDisponible`: Whether parking is available (boolean)
- `parkingInclus`: Whether parking is included in price (boolean)
- `prixParking`: Parking price (when not included)

### Optional Fields
- `status`: Property status (default: "AVAILABLE")
- `notes`: Additional notes
- `threeDViewUrl`: 3D view URL
- `image`: Property image file
- `clientId`: Associated client ID
