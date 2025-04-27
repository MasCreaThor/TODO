// src/controllers/room/getRoomsByHotelId.controller.ts
import { Request, Response } from 'express';
import { roomService } from '../../services';

/**
 * Controlador para obtener habitaciones de un hotel específico
 * @param req Request - Debe incluir param: hotelId y puede incluir query: fechaEntrada, fechaSalida, capacidad
 * @param res Response
 */
export const getRoomsByHotelId = async (req: Request, res: Response) => {
  try {
    const { hotelId } = req.params;
    
    // Extraer y preparar opciones de filtro
    const filterOptions = {
      fechaEntrada: req.query.fechaEntrada as string,
      fechaSalida: req.query.fechaSalida as string,
      capacidad: req.query.capacidad ? Number(req.query.capacidad) : undefined
    };
    
    // Utilizar el servicio para buscar habitaciones
    const rooms = await roomService.findRoomsByHotelId(hotelId, filterOptions);
    
    // Verificar si el hotel existe
    if (rooms === null) {
      return res.status(404).json({ message: `Hotel con ID ${hotelId} no encontrado` });
    }
    
    // Enviar respuesta
    res.json(rooms);
  } catch (error) {
    console.error('Error al obtener habitaciones por hotel ID:', error);
    res.status(500).json({ message: 'Error al obtener las habitaciones', error });
  }
};

export default getRoomsByHotelId;