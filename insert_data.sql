-- Nonaktifin FK check sementara biar urutan insert nggak masalah
SET FOREIGN_KEY_CHECKS=0;

-- ============ USERS ============
INSERT INTO `users` (`id`,`email`,`username`,`password`,`nama`,`role`,`game_id`,`server_id`,`otp`,`status`,`createdAt`,`updatedAt`,`usernameUpdatedAt`,`pfp`) VALUES
('0bd73b7d-c5bd-45c8-b540-70ff5fa6158f','firman23mei2009@gmail.com','Timeless. ','$2b$10$we2OdZWds61jKDntIe6m7upC0WzRoE2s1HU8fSDzPGPcHbHk.2f7K','Arvian Maulana Firmansyah ','user','947936004','13068',NULL,1,'2026-06-20 07:30:22.458','2026-06-20 07:31:30.084',NULL,NULL),
('1b787c54-f355-4c3b-9c63-eca6a1898e99','yuyuiii571@gmail.com','Louys.','$2b$10$qHvIokqmNlmwuP1Rj2sjrucJwKP/K9IOPrNt6t.ahc9sqnsbZOFj2','louys si raja junglar','user','434163928','22666',NULL,1,'2026-06-20 07:13:56.294','2026-06-20 07:21:07.642',NULL,NULL),
('2ea835df-9ab2-4cc1-b9a9-68616c39fff6','ridhofirdaus321@gmail.com','ido8king','$2b$10$FthcWxWsIVEB2D0azkwlA.YyPPFF74A0FLmaoDYx5UF9hXPneABs.','Ridho Firdaus ','admin','69320613','2126','$2b$10$iFG6zKz1WHWNRv8No6neTO0OqQBt0j4bu1uuv394DrSiY4kaO158W',1,'2026-06-15 17:35:01.564','2026-07-08 16:31:08.848','2026-06-18 13:49:56.254','ido8king.jpg'),
('3c9d35ba-8a07-4d47-a6fb-cc5d9633e1c4','qzelskie@gmail.com','Hazelskie','$2b$10$FygiVP.kyZeiaxzWuYJUMOlJBLq6QIHgim9Xcxg6KaEFAjMOYsSXi','Zidan Ali Zulkarnaen','admin','1310218213','15333',NULL,1,'2026-06-16 10:25:35.147','2026-07-08 02:46:13.492',NULL,'Hazelskie.jpg'),
('53b8ec08-8abc-4d95-a921-d612eedfd774','kmsfh64908@minitts.net','totorot','$2b$10$BX/lvOZ6PDhQF/s7nEvQleySueh/1lJsf4gZIGnvBv4AgIZxpfbbq','tess lagi','admin','393991001','1112',NULL,1,'2026-07-08 16:16:23.773','2026-07-08 16:20:46.866',NULL,'totorot.jpg'),
('6aaca1bf-916e-4345-8209-c1f3e8c52505','hixoulohoxe-9232@yopmail.com','tester','$2b$10$DoMIg6iiQpiPEMdvrdq4teq2bggT7Kx4veS8IXWOcbFzcDDulGkpq','Akun tester','user','26272828','2550',NULL,1,'2026-07-02 05:05:37.500','2026-07-02 05:07:00.365',NULL,NULL),
('6c20d7aa-45db-4b4a-a2ef-52f146da50ee','butrosmelandri833@gmail.com','Syver','$2b$10$K7LiGXCQFNIhU9iPnSCj.uURwUXfm33rSK2PAV9yOboAMf94Y.xs2','Butros Melandri Christian ','user','46451617','2072',NULL,1,'2026-07-02 05:00:53.267','2026-07-02 05:02:00.844',NULL,NULL),
('7717a40e-8f46-47da-99e2-103274b95f20','jamsurya01@gmail.com','Pemain Gold','$2b$10$jY3Lx7GZzTAKxrVaiXJerOpU/qL.pokf2FQDxsCBtmrhLpzaNR/ti','Hafid Dwi Januar','admin','335728','2001',NULL,1,'2026-06-16 10:04:49.264','2026-07-11 10:06:24.227','2026-06-18 17:52:35.602','Pemain Gold.jpg'),
('79f7c4f1-c18b-41f4-b467-426105ab4643','jamsurya02@gmail.com','Test User ','$2b$10$NwG4n.tjNnfTMNSnJDMiJOAQp0EXi26AEWGDe3Gky4uOvmNeXhowm','User Ekstrakulikuler','user','986474','2948',NULL,1,'2026-06-22 03:39:55.266','2026-07-11 10:07:18.871',NULL,'Test User .jpg'),
('84c95106-191e-4f56-8930-2e9ed472b000','imamsubahkri4702@gmail.com','Arkyy.','$2b$10$ka4fW0/txXz/ZzcEkBEE5O39oPGN1sewMtgVNAdhu8Smq8jGYYLge','imam subahkri','user','926828902','12668',NULL,1,'2026-06-20 07:13:49.942','2026-06-20 07:14:52.095',NULL,NULL),
('8d0bf820-43f2-4c37-a5f7-2b03b124d04f','grigori.zakharov@gmail.com','sebuzz','$2b$10$LcG37lL2eBTNsFV7ixFPC.QSRnJVF7t6ZUkdKvRI8UmzcsrTZzAJS','Muhammad haekal ','user','246421250','9290',NULL,1,'2026-06-20 07:25:54.890','2026-06-20 07:26:59.753',NULL,NULL),
('9166a9db-7063-453b-9c79-087f46ff09ba','bengg0236@gmail.com','Enzell. / BENGG','$2b$10$jA/dxSgaXiwt0PTFWsyTI.aC0NMTrLDPXofUedKICg0Nljm55u/Vu','Ahmad Zubair','user','269256313','3547',NULL,1,'2026-06-20 07:08:33.704','2026-06-20 07:11:57.908',NULL,NULL),
('9761e133-7fde-4e41-976e-513d4ef2359d','metib43020@heavty.com','remawaa','$2b$10$4B3tBS7SnS8ZHUHYjNslceKDukzQJkZlEGMTw8kcB8o0rDm6tvOa.','Tes','user','26272828','2126','$2b$10$i4dvOT9W/POfdPGn2jvuIOgZcIlPv2QVKyXJiIHIwVBcBidH1OtH2',0,'2026-07-02 05:00:36.503','2026-07-02 05:00:36.503',NULL,NULL),
('9c0182b4-09de-4268-b0f3-21cf3eca5258','abbygailmikhaila@gmail.com','mika','$2b$10$KiEYxm0Urjdi7Zl.Iu84L.vVQi6913KmrS.yKZtfHrfaY2oBaWSuq','abbygail mikhaila','admin','1029771188','13135',NULL,1,'2026-06-18 13:08:35.169','2026-07-09 06:19:38.585',NULL,'mika.jpg'),
('9dc262d8-7969-4839-8889-6d05c9b487b8','wildanadiba666@gmail.com','K1NGDAN','$2b$10$KSRT4ai8bgYe6YepyLXIiOFcRcBpzfdUO.9x1zUjJM0INRBoaqkpm',' Muhammad wildan adiba mansyur','user','634202615','8530',NULL,1,'2026-06-20 07:24:49.521','2026-06-20 07:27:52.053',NULL,NULL),
('a7b54717-5e73-442c-a902-a2ff7c72e718','rshoffafalqoum@gmail.com','Ranzz','$2b$10$Q.G8.m3qoduzZZWJOFyGQuPVuYn5MrDvt8LyxA1h08UtWZsNa7wIi','Raissa Shoffafal Qoum ','user','1864352559 ','18991',NULL,1,'2026-06-20 07:09:13.740','2026-06-20 07:11:59.484',NULL,NULL),
('ae06f66f-1913-4a18-abf9-c05376e7798d','ravaruhiyat1@gmail.com','Zhephyros','$2b$10$S.F.bjUNdYxKlUEtIdZwz.V0s4J58VNM214rk4DsR872pT1i0jWGi','rava ruhiyat','user','581975229 ','8336',NULL,1,'2026-06-20 07:23:49.922','2026-06-20 07:24:51.300',NULL,NULL),
('b81de770-1186-4cae-9070-669c6b18e7ec','wbe3646@gmail.com','isotopik','$2b$10$NPiTES76gfe6oKrlfVwfxOc7rDDErpnNHTQun3I7YLmwsf01YAgfa','Wannasaela','user','26272828','3712',NULL,1,'2026-06-15 18:02:53.332','2026-07-07 17:17:09.633','2026-06-18 13:59:44.987','isotopik.jpg'),
('c2111690-9ea4-49bf-9464-3df2b10a15c2','reyhanmuzakki08@gmail.com','ryuura','$2b$10$ZnszDACf4iorOquhGVfpcuuetx/qmKtCwiqwe3uqUYeMzgiybPnJi','M.Reyhan Muzakki','user','902260573','12577',NULL,1,'2026-07-02 05:00:58.489','2026-07-02 05:02:08.938',NULL,NULL),
('ca125257-0314-4953-8500-5b089e46af95','johnsimkha1090@gmail.com','Joya','$2b$10$ttxGwrkvtejLPTG1xaylb.4eL6cm4MLJixlvwgBvA5u9k//3yBoI2','John Simkha Zane Bracha','user','763736936','12055',NULL,1,'2026-06-20 07:27:55.117','2026-06-20 07:29:25.122',NULL,NULL),
('d775ba4e-2de5-4eb7-8974-9b1cd453a2ed','bernardinadiera04@gmail.com','nattzy','$2b$10$DrN9HsgjHlrQUlGsqibhbe9IXuIWJAOtIUeGD5CpxPn27wDRtrqfm','bernardin adiera mahardika','user','1310903507','15343',NULL,1,'2026-07-02 05:06:49.529','2026-07-02 05:08:15.553',NULL,NULL),
('ebd16a25-a67d-4372-b09d-e21a10faddc0','asedxin@gmail.com','Adit','$2b$10$Mw8jbmjk3yE2ZFMrJugQU.sD7/.NtQVX60rmImtEzYSdXiddvzf8G','Aditya','user','2343846','2550',NULL,1,'2026-07-02 04:59:03.796','2026-07-08 02:17:29.126',NULL,'Adit.jpg'),
('f5a8405f-d6d2-4b40-9e8d-02485582358d','saputrarifki1412@gmail.com','kinss hathaway','$2b$10$D9Is30vcYn9sSjr6LNqS9.2E2ILZwStjL1fr2NetszMmn6MSiMFlS','Muhammad Saputra Rifki','user','284940382','9486',NULL,1,'2026-06-20 07:26:26.301','2026-06-20 07:27:52.029',NULL,NULL);

-- ============ TEAMS ============
INSERT INTO `teams` (`id`,`nama_tim`) VALUES
(6,'SMEGIONE ETERNAL'),
(7,'SMEGIONE ERYTHAL'),
(10,'AKSJAKSJ');

-- ============ TEAMMEMBER ============
INSERT INTO `teammember` (`id`,`teamId`,`userId`,`role`,`joinedAt`) VALUES
(6,7,'84c95106-191e-4f56-8930-2e9ed472b000','roam','2026-06-20 07:28:09.516'),
(7,6,'8d0bf820-43f2-4c37-a5f7-2b03b124d04f','jungle','2026-06-20 07:28:24.997'),
(9,6,'ae06f66f-1913-4a18-abf9-c05376e7798d','roam','2026-06-20 07:29:33.563'),
(10,7,'9dc262d8-7969-4839-8889-6d05c9b487b8','jungle','2026-06-20 07:29:47.930'),
(11,6,'ca125257-0314-4953-8500-5b089e46af95','exp','2026-06-20 07:30:06.680'),
(12,6,'0bd73b7d-c5bd-45c8-b540-70ff5fa6158f','mid','2026-06-20 07:32:13.653'),
(13,6,'1b787c54-f355-4c3b-9c63-eca6a1898e99','gold','2026-06-20 07:32:39.735'),
(16,10,'b81de770-1186-4cae-9070-669c6b18e7ec','jungle','2026-07-02 05:16:40.780'),
(17,7,'c2111690-9ea4-49bf-9464-3df2b10a15c2','mid','2026-07-02 05:18:00.531'),
(18,7,'6c20d7aa-45db-4b4a-a2ef-52f146da50ee','gold','2026-07-02 05:18:14.280');

-- ============ KEGIATAN ============
-- Catatan: kolom lama "jam" dipindah ke "jam_mulai". jam_selesai, lokasi, deskripsi, google_event_id belum ada datanya (NULL).
INSERT INTO `kegiatan` (`id`,`nama_kegiatan`,`tanggal_kegiatan`,`jam_mulai`,`jam_selesai`,`lokasi`,`deskripsi`,`onlyTeam`,`attachment`,`google_event_id`,`createdAt`,`updatedAt`) VALUES
('848368af-b469-4ed4-934b-89e6b263797c','Testing frontend','2026-07-08 00:00:00.000','14:00',NULL,NULL,NULL,0,'Project Plan - [CC26-PSU322].pdf',NULL,'2026-07-07 17:29:45.373','2026-07-07 17:29:45.373'),
('96d7d4b5-4087-44be-82e7-fe60bf91b38e','abcd','2026-07-02 00:00:00.000','12:10',NULL,NULL,NULL,0,'ESPORT SMEGIONE DEMOS PPT.pdf',NULL,'2026-07-02 05:09:42.325','2026-07-08 02:47:51.132');

-- ============ ABSENSI ============
INSERT INTO `absensi` (`id`,`user_id`,`kegiatan_id`,`deskripsi`,`mood`,`bukti`,`createdAt`) VALUES
(6,'6c20d7aa-45db-4b4a-a2ef-52f146da50ee','96d7d4b5-4087-44be-82e7-fe60bf91b38e','mtk','buruk','Butros Melandri Christian -02-06-2026.jpg','2026-07-02 05:10:45.430'),
(7,'6aaca1bf-916e-4345-8209-c1f3e8c52505','96d7d4b5-4087-44be-82e7-fe60bf91b38e','seru sekali','baik','Akun tester-02-06-2026.png','2026-07-02 05:11:20.931'),
(8,'ca125257-0314-4953-8500-5b089e46af95','96d7d4b5-4087-44be-82e7-fe60bf91b38e','Scrim','baik','John Simkha Zane Bracha-02-06-2026.jpg','2026-07-02 05:11:26.350'),
(9,'a7b54717-5e73-442c-a902-a2ff7c72e718','96d7d4b5-4087-44be-82e7-fe60bf91b38e','bahry bot ','biasa','Raissa Shoffafal Qoum -02-06-2026.jpg','2026-07-02 05:12:13.021'),
(10,'0bd73b7d-c5bd-45c8-b540-70ff5fa6158f','96d7d4b5-4087-44be-82e7-fe60bf91b38e','Laning phase','biasa','Arvian Maulana Firmansyah -02-06-2026.jpg','2026-07-02 05:12:33.764'),
(11,'9166a9db-7063-453b-9c79-087f46ff09ba','96d7d4b5-4087-44be-82e7-fe60bf91b38e','website smegione esport','biasa','Ahmad Zubair-02-06-2026.png','2026-07-02 05:33:17.003');

-- Nyalain lagi FK check
SET FOREIGN_KEY_CHECKS=1;