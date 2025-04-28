// src/controllers/booking/createBooking.controller.ts
import { Request, Response, NextFunction } from 'express';
import { bookingService } from '../../services';

/**
 * Controlador para crear una nueva reserva
 * @param req Request - Debe incluir userId (añadido por middleware de autenticación)
 * @param res Response
 * @param next NextFunction
 */
const createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Verificar que el usuario está autenticado
    if (!req.userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }
    
    const { habitacionId, fechaEntrada, fechaSalida, numeroHuespedes, comentarios } = req.body;
    
    // Validar datos requeridos
    if (!habitacionId || !fechaEntrada || !fechaSalida || !numeroHuespedes) {
      res.status(400).json({ 
        message: 'Datos incompletos. Se requiere: habitacionId, fechaEntrada, fechaSalida, numeroHuespedes' 
      });
      return;
    }
    
    // Validar que fechaEntrada sea anterior a fechaSalida
    const startDate = new Date(fechaEntrada);
    const endDate = new Date(fechaSalida);
    
    if (startDate >= endDate) {
      res.status(400).json({ 
        message: 'La fecha de entrada debe ser anterior a la fecha de salida' 
      });
      return;
    }
    
    // Validar que no se intente hacer una reserva para fechas pasadas
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Inicio del día actual
    
    if (startDate < today) {
      res.status(400).json({ 
        message: 'No se puede crear una reserva para fechas pasadas' 
      });
      return;
    }
    
    // Utilizar el servicio para crear la reserva
    const booking = await bookingService.createBooking(req.userId, {
      habitacionId,
      fechaEntrada,
      fechaSalida,
      numeroHuespedes,
      comentarios
    });
    
    // Enviar respuesta
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error al crear reserva:', error);
    
    // Determinar si es un error de validación o del servidor
    const isValidationError = error instanceof Error && 
      (error.message.includes('disponible') || 
       error.message.includes('capacidad') || 
       error.message.includes('existe'));
    
    res.status(isValidationError ? 400 : 500).json({ 
      message: isValidationError ? error.message : 'Error al crear la reserva',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export default createBooking;