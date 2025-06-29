# Payment Calculation Update

## Overview
The payment calculation logic has been updated to include folder fees and follow a new formula for first payment calculation.

## New First Payment Formula

The first payment is now calculated as:

```
firstPayment = 20% of basePropertyPrice + folderFees + totalExtras + totalCommission
```

Where:
- `basePropertyPrice` = `totalPropertyPrice - totalExtras - totalCommission`
- `totalExtras` = sum of all property extras (balcony, terrace, pool, parking, mezzanine)
- `totalCommission` = commission calculated based on total surface area
- `folderFees` = separate line item that appears only in the first payment

## Key Changes

### 1. Folder Fees Input
- Added a new input field for folder fees in the reservation modal
- Folder fees are initialized with the project's default value
- Folder fees appear as a separate line item in the UI
- Folder fees are included only in the first payment

### 2. Extras Calculation
The system now calculates the total value of property extras:
- **Balcony**: `balconSurface * (prixM2 * prixBalconPct / 100)`
- **Terrace**: `terrasseSurface * (prixM2 * prixTerrassePct / 100)`
- **Pool**: `piscineSurface * prixPiscine`
- **Parking**: `prixParking` (if not included in base price)
- **Mezzanine**: `mezzaninePrice` (for stores)

### 3. Commission Calculation
Commission is calculated based on total surface area:
- For apartments/villas/duplexes: `(habitable + balcon + terrasse + piscine) * commissionPerM2`
- For land/stores: `(totalArea + mezzanineArea) * commissionPerM2`

### 4. UI Updates
- Added folder fees input section with purple styling
- Added detailed first payment breakdown showing:
  - 20% of base price
  - Folder fees
  - Total extras (with individual breakdown)
  - Commission
  - Total first payment
- Updated validation messages to reflect new requirements
- Updated payment summary to include folder fees

### 5. Validation Updates
- First payment validation now considers the complete formula
- Minimum payment amount includes folder fees, extras, and commission
- Error messages are more descriptive and include breakdown information

## Files Modified

### Frontend
- `front-end/src/utils/paymentValidation.ts` - Updated calculation logic
- `front-end/src/components/example/ModalExample/ReservationProcessModal.tsx` - Updated UI and logic
- `front-end/src/utils/paymentValidation.test.ts` - Added comprehensive tests

### Backend
- `back-end/src/services/payment.service.js` - Updated validation logic

## Example Calculation

For a property with:
- Total price: 12,320,000 MAD
- Balcony: 15m² at 50% of m² price
- Terrace: 25m² at 75% of m² price
- Pool: 10m² at 120,000 MAD/m²
- Parking: 500,000 MAD
- Commission: 1,000 MAD/m²
- Folder fees: 10,000 MAD

**Calculation:**
1. Extras total: 2,093,750 MAD
2. Commission: 170,000 MAD
3. Base property price: 12,320,000 - 2,093,750 - 170,000 = 10,056,250 MAD
4. 20% of base: 10,056,250 × 20% = 2,011,250 MAD
5. **Total first payment: 2,011,250 + 10,000 + 2,093,750 + 170,000 = 4,285,000 MAD**

## Testing

The test file `paymentValidation.test.ts` includes comprehensive tests for:
- Extras calculation
- Commission calculation
- First payment breakdown
- Validation logic
- Edge cases

Run the tests to verify the calculations are working correctly.

## Migration Notes

- Existing payment plans will continue to work
- New reservations will use the updated calculation
- Folder fees are now a required field in the reservation process
- The UI provides clear breakdown of all components in the first payment 