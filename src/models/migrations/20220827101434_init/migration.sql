/*
  Warnings:

  - You are about to drop the column `expiredAt` on the `token` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `token` DROP COLUMN `expiredAt`,
    ADD COLUMN `expiresAt` DATETIME(3) NOT NULL;
