-- Add CLIENT to Role enum if it doesn't exist
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'CLIENT';

-- Ensure ClientStatus enum has correct values
DO $$
BEGIN
    -- Check if ClientStatus enum exists and has correct values
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ClientStatus') THEN
        CREATE TYPE "ClientStatus" AS ENUM ('LEAD', 'CLIENT');
    ELSE
        -- Add missing enum values if they don't exist
        BEGIN
            ALTER TYPE "ClientStatus" ADD VALUE IF NOT EXISTS 'LEAD';
        EXCEPTION
            WHEN duplicate_object THEN NULL;
        END;
        BEGIN
            ALTER TYPE "ClientStatus" ADD VALUE IF NOT EXISTS 'CLIENT';
        EXCEPTION
            WHEN duplicate_object THEN NULL;
        END;
    END IF;
END $$;

-- AlterTable - Add userId column to Client
ALTER TABLE "Client" ADD COLUMN "userId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_key" ON "Client"("userId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
