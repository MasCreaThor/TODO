// src/controllers/booking/getUserBookings.controller.ts
import { Request, Response, NextFunction } from 'express';
import { bookingService } from '../../services';

/**
 * Controlador para obtener las reservas del usuario autenticado
 * @param req Request - Debe incluir userId (añadido por middleware de autenticación)
 * @param res Response
 * @param next NextFunction
 */
const getUserBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Verificar que el usuario está autenticado
    if (!req.userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }
    
    // Utilizar el servicio para obtener las reservas del usuario
    const bookings = await bookingService.getUserBookings(req.userId);
    
    // Enviar respuesta
    res.json(bookings);
  } catch (error) {
    console.error('Error al obtener reservas del usuario:', error);
    res.status(500).json({ 
      message: 'Error al obtener las reservas',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export default getUserBookings;