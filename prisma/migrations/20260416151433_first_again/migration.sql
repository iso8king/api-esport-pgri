-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(36) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `role` ENUM('admin', 'user') NOT NULL,
    `game_id` VARCHAR(191) NOT NULL,
    `server_id` VARCHAR(4) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kegiatan` (
    `id` INTEGER NOT NULL,
    `nama_kegiatan` VARCHAR(100) NOT NULL,
    `tanggal_kegiatan` DATETIME(3) NOT NULL,
    `jam` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `absensi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `kegiatan_id` INTEGER NOT NULL,
    `deskripsi` VARCHAR(1000) NOT NULL,
    `mood` ENUM('baik', 'biasa', 'buruk') NOT NULL,
    `bukti` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teams` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_tim` VARCHAR(50) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `role` ENUM('gold', 'exp', 'mid', 'jungle', 'roam') NOT NULL,

    UNIQUE INDEX `teams_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `absensi` ADD CONSTRAINT `absensi_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `absensi` ADD CONSTRAINT `absensi_kegiatan_id_fkey` FOREIGN KEY (`kegiatan_id`) REFERENCES `kegiatan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teams` ADD CONSTRAINT `teams_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
