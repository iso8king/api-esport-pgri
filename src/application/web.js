import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { publicRouter } from "../routes/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import cors from "cors";
import { adminRouter, siswaRouter, userRouter } from "../routes/api.js";

dotenv.config();
export const web = express();
web.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

const corsOptions = {
  origin: 'http://localhost:5173', // URL frontend exact
  credentials: true, // Wajib true
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'], // Penting!
  preflightContinue: false,
  optionsSuccessStatus: 204
};


web.use(cors(corsOptions));
web.use(express.json());
web.use(cookieParser());
web.use(publicRouter);
web.use(userRouter);
web.use(adminRouter);
web.use(siswaRouter);

web.use(errorMiddleware)


