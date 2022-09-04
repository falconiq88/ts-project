/*
  Warnings:

  - Added the required column `expiresAt` to the `forgot_password` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `forgot_password` ADD COLUMN `expiresAt` DATETIME(3) NOT NULL;
