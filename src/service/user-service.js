import { prismaClient } from "../application/database.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validate } from "../validation/validate.js";
import { changePassword, changePasswordForgetValidation, loginValidation, otpForgetPasswordValidation, otpVerificationValidation, registerUserValidation, updateUserValidation } from "../validation/user-validation.js";
import { responseError } from "../error/response-error.js";
import { stringify } from "uuid";
import { sendOTP, sendOTPForgetPassword } from "../application/mailer.js";

function generateJWT(data, secret_token, duration){
    return jwt.sign(data , secret_token, {expiresIn : duration})
}

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const register = async(request)=>{
    const user = validate(registerUserValidation , request);
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp , 10);
    user.otp = otpHash;
    user.role = user?.role || "user"; // role default
    user.role = user.role.toLowerCase()
    console.log("masuk")

    // password
    user.password = await bcrypt.hash(user.password, 10);
    
    await sendOTP(user.email, otp);
    
    const registerUser = await prismaClient.user.create({
        data : user,
        select: {
            id : true,
            username : true,
            nama : true,
            role : true,
            game_id : true,
            server_id : true
        }
    });
    return registerUser;
};

const login = async(request)=>{
    const loginRequest = validate(loginValidation, request);
    

    const user = await prismaClient.user.findFirst({
  where: {
    OR: [
      { username: loginRequest.username },
      { email: loginRequest.username }
    ]
  },
  select: {
    password: true,
    username: true,
    nama: true,
    role: true,
    game_id: true,
    server_id: true,
    id: true,
    email: true,
    status: true,
    member : {
        select : {
            team : {
                select : {
                    nama_tim : true
                }
            }
        }
    },createdAt : true,pfp : true
  }
});

    

    const data = {
        username : user.username,
        nama : user.nama,
        role : user.role,
        game_id : user.game_id,
        server_id : user.server_id,
        id : user.id,
        status : user.status,
        email : user.email,
        tim : user.member?.team?.nama_tim || 'null',
        akun_dibuat : user.createdAt,
        avatar : user.pfp     
    }

    if (!user) throw new responseError('401', 'Akun kredensial salah!');

    const passwordCheck = await bcrypt.compare(loginRequest.password, user.password);
    if (!passwordCheck) throw new responseError(401, "Akun kredensial salah!");

    const tokenAccess = generateJWT(data, process.env.ACCESS_TOKEN_SECRET, "1h");
    data.token_access = tokenAccess;
    return data
};



const updateProfile = async (id_user, request) => {
  request = validate(updateUserValidation, request);
  const data = {};

  const field = ['nama', 'email', 'game_id', 'server_id'];
  for (const f of field) {
    if (request[f] !== undefined) {
      data[f] = request[f];
    }
  }

  if (request.username !== undefined) {
    const checkUsernameCooldown = await prismaClient.user.findUnique({
      where: { id: id_user },
      select: { usernameUpdatedAt: true }
    });

    if (checkUsernameCooldown?.usernameUpdatedAt) {
      const cooldownParameter = new Date(checkUsernameCooldown.usernameUpdatedAt);
      cooldownParameter.setDate(cooldownParameter.getDate() + 180); 

      if (Date.now() >= cooldownParameter.getTime()) {
        data.username = request.username;
        data.usernameUpdatedAt = new Date()
      } else {
        const sisaCooldown = Math.ceil((cooldownParameter.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        throw new responseError(403, `Akun Kamu masih cooldown ganti username selama ${sisaCooldown} hari lagi`);
      }
    } else {
      data.username = request.username;
      data.usernameUpdatedAt = new Date()
    }
  }

  return prismaClient.user.update({
    where: { id: id_user },
    data
  });
};



const verifyOTP = async (request) => {
  const otpRequest = validate(otpVerificationValidation, request);
  console.log(otpRequest);

  const user = await prismaClient.user.findUnique({
    where: {
      email: otpRequest.email,
    },
    select: {
      otp: true,
      status: true
    },
  });

  if (!user || user.otp === null) {
    throw new responseError(404, "User or OTP Not Found!");
  }

  const otpCheck = await bcrypt.compare(otpRequest.otp , user.otp);

  if (otpCheck === false) throw new responseError(400, "OTP wrong!");

  await prismaClient.user.update({
    where: {
      email: otpRequest.email,
    },
    data: {
      status: true,
      otp: null,
    },
  });

  return "Akun Berhasil Di Verifikasi";
};

const requestOTP= async(email)=>{
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp , 10);

    await prismaClient.user.update({
        where : {
            email : email
        },
        data : {
            otp : otpHash
        }
    })

    await sendOTP(email , otp);
}


// lanjut nanti aja buat change password
const changePW = async(request , id_user)=>{
    request = validate(changePassword, request);
    const user = await prismaClient.user.findUnique({
        where : {
            id : id_user
        },
        select : {
            password : true
        }
    });
    
    const passwordCheck = await bcrypt.compare(request.password, user.password);
    if (!passwordCheck) throw new responseError(401, "Akun kredensial salah!");
    request.password_new = await bcrypt.hash(request.password_new, 10);
    
    await prismaClient.user.update({
        where : {
            id : id_user
        },
        data : {
            password : request.password_new
        }
    })
}

const checkPassword = async (password, id_user) => {
    if (!password) throw new responseError(400, "Password tidak boleh kosong");
    const user = await prismaClient.user.findUnique({
        where: {
            id: id_user
        },
        select: {
            password: true
        }
    });
    
    if (!user) throw new responseError(404, "User tidak ditemukan");
    
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) throw new responseError(401, "Password saat ini salah!");
}

const otpForgetPassword = async(request) =>{
    request = validate(otpForgetPasswordValidation, request);
    const searchUser = await prismaClient.user.count({
        where : {
            email : request.email
        }
    });

    if(!searchUser) throw new responseError(404, "Email Not Found!");

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp , 10);
    const saveOTP = await prismaClient.user.update({
        where : {
            email : request.email
        },
        data :{
            otp : otpHash,
        },
        select : {
            email : true
        }
    });
    
    await sendOTPForgetPassword(request.email, otp);
}

const changePasswordFromForgetPassword = async(cookie,request)=>{
    try {
    const decode = jwt.verify(cookie, process.env.ACCESS_TOKEN_SECRET);
    request = validate(changePasswordForgetValidation, request);
    request.password = await bcrypt.hash(request.password, 10);
    return prismaClient.user.update({
        where : {
            email : decode.email
        },data : {
            password : request.password
        }
    })
    } catch (e) {
        throw new responseError(501, e);  // jangan di tampilin   
    }
}

const verifyOTPChangePassword = async (request) => {
  const otpRequest = validate(otpVerificationValidation, request);
  console.log(otpRequest);

  const user = await prismaClient.user.findUnique({
    where: {
      email: otpRequest.email,
    },
    select: {
      otp: true,
      status: true
    },
  });

  if (!user || user.otp === null) {
    throw new responseError(404, "User or OTP Not Found!");
  }

  const otpCheck = await bcrypt.compare(otpRequest.otp , user.otp);

  if (otpCheck === false) throw new responseError(400, "OTP wrong!");

  const jwtGenerated = generateJWT(otpRequest , process.env.ACCESS_TOKEN_SECRET, '1h');

  await prismaClient.user.update({
    where: {
      email: otpRequest.email,
    },
    data: {
      status: true,
      otp: null,
    },
  });

  
  return jwtGenerated;
};

const uploadPfp = async(request)=>{
    return prismaClient.user.update({
      where : {
        id : request.id
      },data : {
         pfp : request.pfp
      },
      select : {
        pfp : true  
      }
    })
}


export default {
    register,
    login,
    updateProfile,
    verifyOTP,
    requestOTP,
    changePW,
    checkPassword,
    otpForgetPassword,
    changePasswordFromForgetPassword,
    verifyOTPChangePassword,
    uploadPfp
}