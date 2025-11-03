/*
  Warnings:

  - You are about to drop the column `weightCm` on the `weight_records` table. All the data in the column will be lost.
  - Added the required column `heightCm` to the `weight_records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "weight_records" DROP COLUMN "weightCm",
ADD COLUMN     "heightCm" INTEGER NOT NULL;
