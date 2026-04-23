import { prismaClient } from "../application/database.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validate } from "../validation/validate.js";
import { changePassword, loginValidation, otpVerificationValidation, registerUserValidation, updateUserValidation } from "../validation/user-validation.js";
import { responseError } from "../error/response-error.js";
import { stringify } from "uuid";
import { sendOTP } from "../application/mailer.js";

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
    

    const user = await prismaClient.user.findUnique({
        where : {
            username : loginRequest.username
        },select : {
            password : true,
            username : true,
            nama : true,
            role : true,
            game_id : true,
            server_id : true,
            id : true,
            email : true,
            status:true
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
        email : user.email
        
    }

    if (!user) throw new responseError('401', 'Akun kredensial salah!');

    const passwordCheck = await bcrypt.compare(loginRequest.password, user.password);
    if (!passwordCheck) throw new responseError(401, "Akun kredensial salah!");

    const tokenAccess = generateJWT(data, process.env.ACCESS_TOKEN_SECRET, "1h");
    const tokenRefresh = generateJWT(data, process.env.ACCESS_TOKEN_SECRET, "14w");
    data.token_access = tokenAccess;
    data.token_refresh = tokenRefresh
    return data
};

const updateProfile = async(id_user,request)=>{
    request = validate(updateUserValidation, request);
    const data = {};

    const field = ['nama' , 'username' , 'game_id' , 'server_id']

    for (const f of field) {
        if(request[f] !== "undefined"){
            data[f] = request[f]
        }      
    }

    return prismaClient.user.update({
        where: {
            id : id_user
        },
        data
    })

}


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

console.log(otpRequest.otp , user.otp)
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

// lanjut nanti aja buat change password
// const changePassword = async(request)=>{
//     const changePassword = validate(changePassword, request);


// }

// const refreshingToken = (tokenRefresh)=>{
//     if(!tokenRefresh) throw new responseError(401 , 'Token Missing!')
    
//     const refreshTokenVerify = jwt.verify(tokenRefresh, process.env.REFRESH_TOKEN_SECRET);

//     const tokenAccessNew = generateJWT(refreshTokenVerify, process.env.ACCESS_TOKEN_SECRET, "1h");
//     const tokenRefreshNew = generateJWT(refreshTokenVerify, process.env.REFRESH_TOKEN_SECRET, "1w");
//     return {
//     tokenAccess: tokenAccessNew,
//     tokenRefresh: tokenRefreshNew,
//     };
// }

// jangan pake refresh token dulu dah

export default {
    register,
    login,
    updateProfile,
    verifyOTP
}