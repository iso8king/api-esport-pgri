/*
  Warnings:

  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `otp` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(4)`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `email` VARCHAR(100) NOT NULL,
    MODIFY `otp` VARCHAR(4) NOT NULL;
