import { prismaClient } from "../application/database.js";
import { validate } from "../validation/validate.js";
import { responseError } from "../error/response-error.js";
import { addBeritaValidation, addMemberValidation, createKegiatanValidation, getAllValidation, idKegiatanValidation, idTeamValidation, updateKegiatanValidation, updateTeamNameValidation } from "../validation/admin-validation.js";
import { exportSheet } from "../application/excel.js";
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { createCalendarEvent, deleteCalendarEvent, updateCalendarEvent } from "../application/calendar.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createKegiatan = async (request) => {
  request = validate(createKegiatanValidation, request);

  const tanggal = new Date(request.tanggal_kegiatan).toISOString().split("T")[0];
  const date_unify_start = new Date(`${tanggal}T${request.jam_mulai}:00`).toISOString();
  const date_unify_end = new Date(`${tanggal}T${request.jam_selesai}:00`).toISOString();

  const calendar_input = {
    title : request.nama_kegiatan,
    description : request.deskripsi,
    startDateTime : date_unify_start,
    endDateTime : date_unify_end,
    location : request.lokasi
  }

  console.log(calendar_input);

  const googleCalendarId = await createCalendarEvent(calendar_input);

  request.google_event_id = googleCalendarId

  return prismaClient.kegiatan.create({
    data: request
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
  const totalTeamOnly = await prismaClient.kegiatan.count({
    where : {
      onlyTeam : true
    }
  });

  const totalPublic = totalItems - totalTeamOnly;

  const kegiatanTypeTotal = {
    totalTeamOnly,
    totalPublic
  }

  return {
    paging: {
      page: request.page,
      totalItems: totalItems,
      totalPage: Math.ceil(totalItems / request.size),
    },
    data: kegiatan,
    kegiatanTypeTotal
  };
};

const updateKegiatan = async (id_kegiatan, request) => {
  request.id = id_kegiatan;
  request = validate(updateKegiatanValidation, request);
  const data = {};
  const jam = {};

  const field = ["nama_kegiatan", "tanggal_kegiatan", "jam_mulai","jam_selesai", 'deskripsi', 'lokasi',  'onlyTeam', 'attachment'];

  for (const f of field) {
    if (request[f] !== undefined && request[f] !== "undefined") {
      if(f === "jam_mulai"){
        const tanggal = new Date(request.tanggal_kegiatan).toISOString().split("T")[0];
        const date_unify_start = new Date(`${tanggal}T${request.jam_mulai}:00`).toISOString();
        jam[f]  = date_unify_start;
        data[f] = request[f]
      } else if(f === "jam_selesai"){
        const tanggal = new Date(request.tanggal_kegiatan).toISOString().split("T")[0];
        const date_unify_end = new Date(`${tanggal}T${request.jam_selesai}:00`).toISOString();
        jam[f] = date_unify_end;
        data[f] = request[f];
      } else{
        data[f] = request[f]
      }
    }
  }

  const googleCalendarId = await prismaClient.kegiatan.findUnique({
    where : {
      id : request.id
    }, select : {
      google_event_id : true
    }
  })

  try {
    await updateCalendarEvent(googleCalendarId.google_event_id, {
    title : data.nama_kegiatan,
    description : data.deskripsi,
    location : data.lokasi,
    startDateTime : jam.jam_mulai,
    endDateTime : jam.jam_selesai
  })
  } catch (e) {
    console.log(e);    
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

  const kegiatan = await prismaClient.kegiatan.findUnique({
    where : {
      id : id_kegiatan
    }, select : {
      google_event_id : true
    }
  });

  try {
      await deleteCalendarEvent(kegiatan.google_event_id);
  } catch (e) {
    console.log(e)    
  }

  const delKegiatan = await prismaClient.kegiatan.delete({
    where: {
      id: id_kegiatan,
    },
  });

  if(delKegiatan.attachment){
    const filePath = path.join(__dirname, 'assets/attachment', delKegiatan.attachment);
    fs.unlink(filePath, (err) => {
    if (err) {
        console.error('Gagal hapus file:', err);
        return;
      }
        console.log('File berhasil dihapus'); 
    });
  }

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

  // const existingRoleMember = await prismaClient.teamMember.findFirst({
  //   where: {
  //     teamId: request.teamId,
  //     role: request.role,
  //     userId: {
  //       not: request.userId,
  //     },
  //   },
  // });

  // if (existingRoleMember) {
  //   throw new responseError(400, "Role ini sudah digunakan oleh anggota lain di tim ini!");
  // }

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
          kelas : true
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

const deleteTeam = async(id_team)=>{
    id_team = validate(idTeamValidation, id_team)
    const team = await prismaClient.team.delete({
      where : {
        id : id_team
      }
    });

    if(!team) throw new responseError(404, "Team Not Found!");
}

const updateTeamName = async(id_team , request)=>{
  request = validate(updateTeamNameValidation, request)
  id_team = validate(idTeamValidation, id_team)
  const team = await prismaClient.team.update({
     where : {
      id : id_team
    },
    data : {
      nama_tim : request.nama_tim
    },
    select : {
      nama_tim : true
    }
  });

  if(!team) throw new responseError(404, "Team Not Found!")
  return team
}

const addBeritaFromBrogu = async(request) => {
  request = validate(addBeritaValidation, request);

  const response = await fetch(process.env.BROGU_URL + '/api/integrate', {
    method : 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify(request)
  })

  const data = await response.json();

  if (!data) throw new responseError(404, "Artikel Not Found!")

  return prismaClient.berita.create({
      data : {
        ...data,
        link : request.link
      }
  })
}

const getBerita = async(request) => {
  return prismaClient.berita.findMany();
}

const updateBerita = async(id_berita, request) => {
  request = validate(addBeritaValidation, request);

  const response = await fetch(process.env.BROGU_URL + '/api/integrate', {
    method : 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify(request)
  })

  const data = await response.json();

  if (!data) throw new responseError(404, "Artikel Not Found!")

  return prismaClient.berita.update({
    where : {
      id : id_berita
    }, data : {
      ...data,
      link : request.link
    }
  })

}

const deleteBerita = async(id_berita) => {
  const post = await prismaClient.berita.count({
    where : {id : id_berita}
  });

  if(!post) throw new responseError(404, "Artikel Tidak Ditemukan!");

  return prismaClient.berita.delete({
    where : {
      id : id_berita
    }
  })
}

export default {
  updateBerita,
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
  deleteTeam,
  updateTeamName,
  addBeritaFromBrogu,
  getBerita,
  deleteBerita
};
