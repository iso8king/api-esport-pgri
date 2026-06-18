import nodemailer from 'nodemailer'
import { responseError } from "../error/response-error.js";

export const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Perpustakaan Digital" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: "Kode OTP Aktivasi Akun Esport Smegione",
      html: `
        <h3>Halo!</h3>
        <p>Kode OTP aktivasi akun kamu adalah:</p>
        <h1>${otp}</h1>
         `,
    });
  } catch (e) {
    console.log(e.message);
    throw new responseError(500, "Gagal Send email , silahkan cek log server");
  }
};

export const sendOTPForgetPassword = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Perpustakaan Digital" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: "Kode OTP Reset Password Akun Esport Smegione",
      html: `
        <h3>Halo!</h3>
        <p>Kode OTP aktivasi akun kamu adalah:</p>
        <h1>${otp}</h1>
         `,
    });
  } catch (e) {
    console.log(e.message);
    throw new responseError(500, "Gagal Send email , silahkan cek log server");
  }
};