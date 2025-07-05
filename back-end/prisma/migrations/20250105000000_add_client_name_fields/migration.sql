-- CreateEnum
-- This migration adds firstName, lastName, and whatsappNumber fields to the Client model

-- Add new columns to Client table
ALTER TABLE "Client" ADD COLUMN "firstName" TEXT;
ALTER TABLE "Client" ADD COLUMN "lastName" TEXT;
ALTER TABLE "Client" ADD COLUMN "whatsappNumber" TEXT;

-- Update existing records to populate firstName and lastName from name field
-- This is a best-effort approach - you may need to manually adjust some records
UPDATE "Client" 
SET 
  "firstName" = CASE 
    WHEN position(' ' in "name") > 0 THEN substring("name" from 1 for position(' ' in "name") - 1)
    ELSE "name"
  END,
  "lastName" = CASE 
    WHEN position(' ' in "name") > 0 THEN substring("name" from position(' ' in "name") + 1)
    ELSE ''
  END
WHERE "firstName" IS NULL OR "lastName" IS NULL;

-- Make firstName and lastName required (NOT NULL)
ALTER TABLE "Client" ALTER COLUMN "firstName" SET NOT NULL;
ALTER TABLE "Client" ALTER COLUMN "lastName" SET NOT NULL;
