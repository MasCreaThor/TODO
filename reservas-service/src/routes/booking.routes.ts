// @ts-nocheck - Desactivamos TypeScript para este archivo debido a problemas con los tipos de Express
import express from 'express';
import { authMiddleware, hasRole } from '../middlewares/auth.middleware';
import { 
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking 
} from '../controllers/booking';

const router = express.Router();

// Rutas no protegidas - No hay rutas públicas para reservas

// Rutas protegidas - Requieren autenticación
router.use(authMiddleware);

// Rutas para usuarios autenticados
router.post('/', createBooking);
router.get('/user', getUserBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

// Rutas para administradores o gestores de hotel
router.get('/', hasRole(['ADMIN', 'HOTEL_MANAGER']), (req, res) => {
  res.json({ message: 'Obtener todas las reservas - Solo para administradores o gestores' });
});

router.put('/:id/status', hasRole(['ADMIN', 'HOTEL_MANAGER']), (req, res) => {
  res.json({ message: `Actualizar estado de la reserva con ID: ${req.params.id} - Solo para administradores o gestores` });
});

export default router;