/*
  Warnings:

  - You are about to drop the column `WhatsappNumber` on the `Client` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "WhatsappNumber",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "commissionPerM2" DOUBLE PRECISION,
ADD COLUMN     "constructionPhotos" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "folderFees" DOUBLE PRECISION,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'PLANIFICATION',
ADD COLUMN     "totalSales" DOUBLE PRECISION;
