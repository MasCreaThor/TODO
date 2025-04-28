// src/middlewares/cors.middleware.ts
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Opciones de CORS para permitir solicitudes del frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Permitir origen del frontend o cualquiera en desarrollo
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Habilitar cookies/credentials para autenticación
};

export const corsMiddleware = cors(corsOptions);

export default corsMiddleware;