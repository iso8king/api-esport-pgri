/*
  Warnings:

  - The primary key for the `kegiatan` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `absensi` DROP FOREIGN KEY `absensi_kegiatan_id_fkey`;

-- AlterTable
ALTER TABLE `absensi` MODIFY `kegiatan_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `kegiatan` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `absensi` ADD CONSTRAINT `absensi_kegiatan_id_fkey` FOREIGN KEY (`kegiatan_id`) REFERENCES `kegiatan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
