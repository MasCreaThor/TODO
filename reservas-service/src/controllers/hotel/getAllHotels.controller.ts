// src/controllers/hotel/getAllHotels.controller.ts
import { Request, Response } from 'express';
import { hotelService } from '../../services';

/**
 * Controlador para obtener todos los hoteles con filtros opcionales
 * @param req Request - Puede incluir query params: ciudad, categoria, destacado, precioMin, precioMax
 * @param res Response
 */
export const getAllHotels = async (req: Request, res: Response) => {
  try {
    // Extraer y convertir parámetros de consulta
    const filterOptions = {
      ciudad: req.query.ciudad as string,
      categoria: req.query.categoria ? Number(req.query.categoria) : undefined,
      destacado: req.query.destacado === 'true', 
      precioMin: req.query.precioMin ? Number(req.query.precioMin) : undefined,
      precioMax: req.query.precioMax ? Number(req.query.precioMax) : undefined
    };
    
    // Utilizar el servicio para obtener los hoteles filtrados
    const hotels = await hotelService.findAllHotels(filterOptions);
    
    // Enviar respuesta
    res.json(hotels);
  } catch (error) {
    console.error('Error al obtener hoteles:', error);
    res.status(500).json({ message: 'Error al obtener la lista de hoteles', error });
  }
};

export default getAllHotels;