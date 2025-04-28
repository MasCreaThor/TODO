// src/controllers/booking/cancelBooking.controller.ts
import { Request, Response } from 'express';
import { bookingService } from '../../services';

/**
 * Controlador para cancelar una reserva
 * @param req Request - Debe incluir param: id y userId (añadido por middleware de autenticación)
 * @param res Response
 */
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    // Verificar que el usuario está autenticado
    if (!req.userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    
    const { id } = req.params;
    
    try {
      // Utilizar el servicio para cancelar la reserva
      const booking = await bookingService.cancelBooking(id, req.userId);
      
      // Enviar respuesta
      res.json(booking);
    } catch (error) {
      // Capturar errores específicos del servicio
      if (error instanceof Error) {
        if (error.message.includes('permiso') || error.message.includes('ya está cancelada')) {
          return res.status(400).json({ message: error.message });
        }
        if (error.message.includes('no encontrada')) {
          return res.status(404).json({ message: error.message });
        }
      }
      throw error; // Re-lanzar otros errores para ser manejados por el catch externo
    }
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    res.status(500).json({ 
      message: 'Error al cancelar la reserva',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export default cancelBooking;