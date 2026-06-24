import ExcelJS from 'exceljs'
import fs from 'fs'
import path from 'path'

const url = 'https://smegionesport.my.id/' // nanti ganti
export const exportSheet = async(datas) => {
    const workbook = new ExcelJS.Workbook();
    
    const rawSheetName = `Absensi ${datas[0].kegiatan.nama_kegiatan}`;
    const cleanSheetName = rawSheetName
        .replace(/[*?:/\\\[\]]/g, '')
        .substring(0, 31);

    const sheet = workbook.addWorksheet(cleanSheetName || 'Absensi')
    sheet.columns = [
        { header: 'Waktu Absen', key: 'waktu', width: 25 }
        ,{header : "Nama" , key : 'nama' , width : 35},
        {header : 'Deskripsi' , key : 'desc' , width : 50},
        {header : "Mood" , key : "mood" , width: 15},
        {header : "Bukti" , key : "bukti" , width : 50},
    ]

    for (const data of datas) {
        const waktuAbsen = data.createdAt ? new Date(data.createdAt).toLocaleString('id-ID') : '-';
        sheet.addRow({ 
            waktu : waktuAbsen,
            nama : data.user.nama,
            desc : data.deskripsi,
            mood : data.mood,
            bukti : data.bukti ? url + 'assets/' + data.bukti : '-'
         });
    }

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD700' }
    }

    // Ensure assets/excel folder exists
    const dirPath = './assets/excel';
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // Sanitize filename to avoid invalid characters
    const cleanFilename = datas[0].kegiatan.nama_kegiatan.replace(/[/\\?%*:|"<>\s]+/g, '_');
    const filePath = `./assets/excel/absen_${cleanFilename}.xlsx`;

    await workbook.xlsx.writeFile(filePath);
    return filePath;
}

export const hapusSheet = async(path) =>{
    try {
        await fs.promises.unlink(path)
    } catch (e) {
        console.log('Error Menghapus Excel : '+e);        
    }
}

