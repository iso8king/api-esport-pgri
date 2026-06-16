import { prismaClient } from "../application/database.js";
import { validate } from "../validation/validate.js";
import { responseError } from "../error/response-error.js";
import { addMemberValidation, createKegiatanValidation, getAllValidation, idKegiatanValidation, updateKegiatanValidation } from "../validation/admin-validation.js";
import { exportSheet } from "../application/excel.js";

const createKegiatan = async (request) => {
  request = validate(createKegiatanValidation, request);

  return prismaClient.kegiatan.create({
    data: request,
  });
};

const getKegiatan = async (id_kegiatan) => {
  id_kegiatan = validate(idKegiatanValidation, id_kegiatan);
  const kegiatan = await prismaClient.kegiatan.findUnique({
    where: {
      id: id_kegiatan,
    },
  });

  if (!kegiatan) throw new responseError(404, "Kegiatan Not Found!");

  return kegiatan;
};

const getAllKegiatan = async (request) => {
  request = validate(getAllValidation, request);

  const skip = (request.page - 1) * request.size;
  const kegiatan = await prismaClient.kegiatan.findMany({
    skip,
    take: request.size,
    orderBy: {
      id: "desc",
    },
  });

  const totalItems = await prismaClient.kegiatan.count();

  return {
    paging: {
      page: request.page,
      totalItems: totalItems,
      totalPage: Math.ceil(totalItems / request.size),
    },
    data: kegiatan,
  };
};

const updateKegiatan = async (id_kegiatan, request) => {
  request.id = id_kegiatan;
  request = validate(updateKegiatanValidation, request);
  const data = {};

  const field = ["nama_kegiatan", "tanggal", "jam", 'onlyTeam'];

  for (const f of field) {
    if (request[f] !== undefined && request[f] !== "undefined") {
      data[f] = request[f];
    }
  }

  return prismaClient.kegiatan.update({
    where: {
      id: request.id,
    },
    data,
  });
};

const deleteKegiatan = async (id_kegiatan) => {
  id_kegiatan = validate(idKegiatanValidation, id_kegiatan);

  const delKegiatan = await prismaClient.kegiatan.delete({
    where: {
      id: id_kegiatan,
    },
  });

  if (!delKegiatan) throw new responseError(404, "Not Found!");
};

const getAbsensi = async (id_kegiatan) => {
  id_kegiatan = validate(idKegiatanValidation, id_kegiatan);

  const absen = await prismaClient.absensi.findMany({
    where: {
      kegiatan_id: id_kegiatan,
    },
    select: {
      user: {
        select: {
          nama: true,
        },
      },
      kegiatan: {
        select: {
          nama_kegiatan: true,
        },
      },
      deskripsi: true,
      mood: true,
      bukti: true,
    },
  });

  return absen;
};

const getAllUser = async () => {
  return prismaClient.user.findMany({
    where: {
      role: "user",
    },
    select: {
      id: true,
      nama: true,
      username: true,
      member: {
        select: {
          team: {
            select: {
              nama_tim: true,
            },
          },
          role: true,
        },
      },
    },
  });
};

const createTeam = async (nama_tim) => {
  return prismaClient.team.create({
    data: {
      nama_tim,
    },
  });
};

const getAllTeam = async () => {
  return prismaClient.team.findMany();
};

const addingMember = async (request) => {
  request = validate(addMemberValidation, request);

  const existingRoleMember = await prismaClient.teamMember.findFirst({
    where: {
      teamId: request.teamId,
      role: request.role,
      userId: {
        not: request.userId,
      },
    },
  });

  if (existingRoleMember) {
    throw new responseError(400, "Role ini sudah digunakan oleh anggota lain di tim ini!");
  }

  return prismaClient.teamMember.upsert({
    where: {
      userId: request.userId,
    },
    update: {
      teamId: request.teamId,
      role: request.role,
    },
    create: request,
    select: {
      teamId: true,
      userId: true,
      role: true,
    },
  });
};

const removeMember = async (userId) => {
  return prismaClient.teamMember.delete({
    where: {
      userId: userId,
    },
  });
};

const statistik = async () => {
  const countUser = await prismaClient.user.count({
    where: {
      role: "user",
    },
  });

  const countOnTeam = await prismaClient.user.count({
    where: {
      member: {
        isNot: null,
      },
    },
  });

  const countNotOnTeam = countUser - countOnTeam;
  const countTeam = await prismaClient.team.count();

  const result = await prismaClient.$queryRaw` SELECT u.nama AS user_nama, u.username, tm.role, t.nama_tim FROM users u LEFT JOIN teammember tm ON u.id = tm.userId LEFT JOIN teams t ON tm.teamId = t.id order by rand(); `;
  return {
    allUser: countUser,
    onTeam: countOnTeam,
    notOnTeam: countNotOnTeam,
    allTeam: countTeam,
    sampleAnggota: result,
  };
};

const exportExcel = async (id_kegiatan) => {
  id_kegiatan = validate(idKegiatanValidation, id_kegiatan);

  const kegiatan = await prismaClient.kegiatan.findUnique({
    where: {
      id: id_kegiatan,
    },
  });

  if (!kegiatan) {
    throw new responseError(404, "Tidak ada data untuk disimpan!");
  }

  const absen = await prismaClient.absensi.findMany({
    where: {
      kegiatan_id: id_kegiatan,
    },
    select: {
      user: {
        select: {
          nama: true,
        },
      },
      kegiatan: {
        select: {
          nama_kegiatan: true,
        },
      },
      deskripsi: true,
      mood: true,
      bukti: true,
      createdAt: true,
    },
  });

  if (absen.length === 0) {
    throw new responseError(400, "Belum ada absensi untuk kegiatan ini");
  }

  return exportSheet(absen);
};

export default {
  exportExcel,
  createKegiatan,
  getKegiatan,
  getAllKegiatan,
  updateKegiatan,
  deleteKegiatan,
  getAbsensi,
  getAllUser,
  createTeam,
  getAllTeam,
  addingMember,
  removeMember,
  statistik,
};
