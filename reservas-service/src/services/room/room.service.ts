// src/services/room/room.service.ts
import { roomRepository } from '../../repositories';
import { RoomFilterCriteria } from '../../repositories/room.repository';

/**
 * Interfaz para filtrar habitaciones a nivel de servicio
 */
export interface RoomFilterOptions {
  fechaEntrada?: string;
  fechaSalida?: string;
  capacidad?: number;
}

/**
 * Servicio dedicado a la lógica de negocio relacionada con habitaciones
 */
class RoomService {
  /**
   * Obtiene una habitación por su ID
   */
  async findRoomById(id: number | string) {
    return await roomRepository.findById(id);
  }

  /**
   * Obtiene habitaciones por ID de hotel con filtros opcionales
   */
  async findRoomsByHotelId(hotelId: number | string, filterOptions: RoomFilterOptions = {}) {
    // Verificar si el hotel existe
    const hotelExists = await roomRepository.hotelExists(hotelId);
    if (!hotelExists) {
      return null;
    }
    
    // Preparar criterios de filtro para el repositorio
    const repositoryCriteria: RoomFilterCriteria = {
      hotelId,
      capacidad: filterOptions.capacidad
    };
    
    // Obtener habitaciones
    const rooms = await roomRepository.findByHotelId(hotelId, repositoryCriteria);
    
    // Si se proporcionan fechas, verificar disponibilidad
    const { fechaEntrada, fechaSalida } = filterOptions;
    if (fechaEntrada && fechaSalida) {
      return this.checkAvailabilityForRooms(rooms, fechaEntrada, fechaSalida);
    }
    
    return rooms;
  }

  /**
   * Verifica disponibilidad de habitaciones para fechas específicas
   * @private
   */
  private async checkAvailabilityForRooms(rooms: any[], fechaEntrada: string, fechaSalida: string) {
    return Promise.all(rooms.map(async (room) => {
      const roomData = room.toJSON();
      const isAvailable = await this.isRoomAvailable(room.id, fechaEntrada, fechaSalida);
      roomData.disponible = isAvailable && room.disponibilidad;
      return roomData;
    }));
  }

  /**
   * Verifica la disponibilidad de una habitación para fechas específicas
   */
  async checkRoomAvailabilityForDates(roomId: number | string, fechaEntrada: string, fechaSalida: string) {
    return await this.isRoomAvailable(roomId, fechaEntrada, fechaSalida);
  }

  /**
   * Determina si una habitación está disponible para unas fechas específicas
   * @private
   */
  private async isRoomAvailable(roomId: number | string, fechaEntrada: string, fechaSalida: string) {
    // Verificar si la habitación existe y está marcada como disponible
    const room = await roomRepository.findById(roomId);
    if (!room || !room.disponibilidad) {
      return false;
    }
    
    // Buscar reservas que se solapan
    const overlappingBookings = await roomRepository.findOverlappingBookings(
      roomId, 
      fechaEntrada, 
      fechaSalida
    );
    
    // La habitación está disponible si no hay reservas solapadas
    return overlappingBookings.length === 0;
  }
}

export default new RoomService();