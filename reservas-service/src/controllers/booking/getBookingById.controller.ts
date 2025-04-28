// src/controllers/booking/getBookingById.controller.ts
import { Request, Response } from 'express';
import { bookingService } from '../../services';

/**
 * Controlador para obtener una reserva específica por su ID
 * @param req Request - Debe incluir param: id y userId (añadido por middleware de autenticación)
 * @param res Response
 */
export const getBookingById = async (req: Request, res: Response) => {
  try {
    // Verificar que el usuario está autenticado
    if (!req.userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    
    const { id } = req.params;
    
    // Utilizar el servicio para buscar la reserva por ID
    const booking = await bookingService.getBookingById(id);
    
    // Verificar si la reserva existe
    if (!booking) {
      return res.status(404).json({ message: `Reserva con ID ${id} no encontrada` });
    }
    
    // Verificar que la reserva pertenece al usuario o el usuario es administrador/gestor de hotel
    if (booking.userId !== req.userId && req.userRole !== 'ADMIN' && req.userRole !== 'HOTEL_MANAGER') {
      return res.status(403).json({ message: 'No tiene permiso para ver esta reserva' });
    }
    
    // Enviar respuesta
    res.json(booking);
  } catch (error) {
    console.error('Error al obtener reserva por ID:', error);
    res.status(500).json({ 
      message: 'Error al obtener la reserva',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export default getBookingById;