# Test GET Apartment Endpoints

## Test the apartment you just created (ID: 6)

### GET Single Apartment
```bash
curl -X GET "http://localhost:3001/api/apartments/6" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### GET All Apartments
```bash
curl -X GET "http://localhost:3001/api/apartments" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### GET Apartments by Project
```bash
curl -X GET "http://localhost:3001/api/projects/2/apartments" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Expected Enhanced Fields in Response

The response should now include all these enhanced fields:

### Core Fields (existing)
- id, number, floor, type, area, threeDViewUrl, price, pricePerM2, zone, image, status, notes, prixType
- projectId, clientId, userId, createdAt, updatedAt

### New Enhanced Fields
- **Surface measurements**: habitable, balcon, terrasse, piscine
- **Land/Store fields**: totalArea, mezzanineArea, mezzaninePrice  
- **Commission**: commissionPerM2
- **Percentage pricing**: prixBalconPct, prixTerrassePct, prixPiscine
- **Parking**: parkingDisponible, parkingInclus, prixParking

## Sample Expected Response for Apartment ID 6

```json
{
  "id": 6,
  "number": "A101",
  "floor": 3,
  "type": "APARTMENT",
  "area": 0,
  "threeDViewUrl": "https://example.com/3d-view/a101",
  "price": 850000,
  "pricePerM2": 12000,
  "zone": "Zone A",
  "image": "",
  "status": "AVAILABLE",
  "notes": "Appartement moderne avec vue sur mer",
  "prixType": "M2",
  
  // Enhanced fields (should be null if not set during creation)
  "habitable": null,
  "balcon": null,
  "terrasse": null,
  "piscine": null,
  "totalArea": null,
  "mezzanineArea": null,
  "mezzaninePrice": null,
  "commissionPerM2": null,
  "prixBalconPct": null,
  "prixTerrassePct": null,
  "prixPiscine": null,
  "parkingDisponible": false,
  "parkingInclus": false,
  "prixParking": null,
  
  "projectId": 2,
  "clientId": 0,
  "userId": 0,
  "createdAt": "2025-07-06T01:20:02.538Z",
  "updatedAt": "2025-07-06T01:20:02.538Z"
}
```

## Verification Checklist

✅ **All enhanced fields present in response**
✅ **Null values for unset enhanced fields**  
✅ **Boolean fields return proper true/false values**
✅ **Number fields return proper numeric values**
✅ **Response schema matches API documentation**
✅ **All three GET endpoints return enhanced fields**

## If Enhanced Fields Are Missing

If the enhanced fields are not appearing in the response, the issue is likely:

1. **Database migration not applied** - Run the migration again
2. **Prisma client not regenerated** - Run `npx prisma generate`
3. **Server not restarted** - Restart the backend server
4. **Caching issues** - Clear any API response caching

## Postman Test

In Postman, create a GET request:
- **URL**: `{{baseUrl}}/api/apartments/6`
- **Headers**: `Authorization: Bearer {{token}}`
- **Expected**: 200 OK with all enhanced fields in response
