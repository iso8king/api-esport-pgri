/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[otp]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otp` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Tambahkan kolom dengan nilai default
ALTER TABLE `users` ADD COLUMN `email` VARCHAR(191) NOT NULL DEFAULT 'temp@email.com';
ALTER TABLE `users` ADD COLUMN `otp` VARCHAR(191) NOT NULL DEFAULT 'temp_otp';

-- Setelah itu, update data yang ada (opsional)
UPDATE `users` SET `email` = CONCAT(id, '@user.com') WHERE `email` = 'temp@email.com';

-- CreateIndex
CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);


