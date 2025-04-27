// src/repositories/room.repository.ts
import { Op } from 'sequelize';
import { Room, Hotel, Booking } from '../models';

/**
 * Interface para filtros de búsqueda de habitaciones
 */
export interface RoomFilterCriteria {
  hotelId?: number | string;
  capacidad?: number;
}

/**
 * Repositorio para operaciones de acceso a datos de Habitaciones
 */
class RoomRepository {
  /**
   * Encuentra una habitación por su ID
   */
  async findById(id: number | string) {
    return await Room.findByPk(id, {
      include: [
        {
          model: Hotel,
          as: 'hotel'
        }
      ]
    });
  }

  /**
   * Encuentra habitaciones por ID de hotel y otros criterios
   */
  async findByHotelId(hotelId: number | string, criteria: RoomFilterCriteria = {}) {
    const { capacidad } = criteria;
    
    const whereConditions: any = {
      hotelId
    };
    
    // Filtrar por capacidad si se proporciona
    if (capacidad) {
      whereConditions.capacidad = { [Op.gte]: Number(capacidad) };
    }
    
    return await Room.findAll({
      where: whereConditions,
      include: [
        {
          model: Hotel,
          as: 'hotel'
        }
      ]
    });
  }

  /**
   * Verifica si un hotel existe
   */
  async hotelExists(hotelId: number | string) {
    const hotel = await Hotel.findByPk(hotelId);
    return !!hotel;
  }

  /**
   * Encuentra reservas que se solapan con un período de fechas
   */
  async findOverlappingBookings(roomId: number | string, fechaEntrada: Date | string, fechaSalida: Date | string) {
    return await Booking.findAll({
      where: {
        habitacionId: roomId,
        estado: {
          [Op.notIn]: ['CANCELADA']
        },
        [Op.or]: [
          {
            // Caso 1: fechaEntrada está entre fechaEntrada y fechaSalida de una reserva existente
            fechaEntrada: {
              [Op.lte]: new Date(fechaEntrada)
            },
            fechaSalida: {
              [Op.gte]: new Date(fechaEntrada)
            }
          },
          {
            // Caso 2: fechaSalida está entre fechaEntrada y fechaSalida de una reserva existente
            fechaEntrada: {
              [Op.lte]: new Date(fechaSalida)
            },
            fechaSalida: {
              [Op.gte]: new Date(fechaSalida)
            }
          },
          {
            // Caso 3: fechaEntrada y fechaSalida abarcan completamente una reserva existente
            fechaEntrada: {
              [Op.gte]: new Date(fechaEntrada)
            },
            fechaSalida: {
              [Op.lte]: new Date(fechaSalida)
            }
          }
        ]
      }
    });
  }
}

export default new RoomRepository();