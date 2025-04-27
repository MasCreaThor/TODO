// src/controllers/hotel/getDestacadosHotels.controller.ts
import { Request, Response } from 'express';
import { hotelService } from '../../services';

/**
 * Controlador para obtener los hoteles destacados
 * @param req Request
 * @param res Response
 */
export const getDestacadosHotels = async (req: Request, res: Response) => {
  try {
    // Usar el servicio para obtener los hoteles destacados
    // Se puede configurar un límite específico, por defecto es 6
    const hotels = await hotelService.findDestacadosHotels(6);
    
    // Enviar respuesta
    res.json(hotels);
  } catch (error) {
    console.error('Error al obtener hoteles destacados:', error);
    res.status(500).json({ message: 'Error al obtener hoteles destacados', error });
  }
};

export default getDestacadosHotels;