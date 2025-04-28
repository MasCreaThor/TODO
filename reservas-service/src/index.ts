// src/index.ts
import express, { Application } from 'express';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import { seedDatabase } from './config/seeders';
import './models';
import hotelRoutes from './routes/hotel.routes';
import roomRoutes from './routes/room.routes';
import bookingRoutes from './routes/booking.routes';
import corsMiddleware from './middlewares/cors.middleware';

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

// Ruta de prueba y health check
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de Reservas de Hoteles' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

// Inicializar base de datos, insertar datos de prueba y arrancar servidor
const startServer = async () => {
  try {
    await initializeDatabase();
    
    // Insertar datos de prueba
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
};

startServer();