// src/services/booking/booking.service.ts
import bookingRepository, { CreateBookingData } from '../../repositories/booking.repository';
import roomRepository from '../../repositories/room.repository';
import { BookingStatus, Room } from '../../models';

/**
 * Interface para crear una reserva
 */
export interface CreateBookingInput {
  habitacionId: number;
  fechaEntrada: string;
  fechaSalida: string;
  numeroHuespedes: number;
  comentarios?: string;
}

/**
 * Servicio dedicado a la lógica de negocio relacionada con reservas
 */
class BookingService {
  /**
   * Crea una nueva reserva verificando disponibilidad y calculando precio total
   */
  async createBooking(userId: string, bookingInput: CreateBookingInput) {
    const { habitacionId, fechaEntrada, fechaSalida, numeroHuespedes, comentarios } = bookingInput;
    
    // Verificar que la habitación existe
    const room = await roomRepository.findById(habitacionId);
    if (!room) {
      throw new Error(`La habitación con ID ${habitacionId} no existe`);
    }
    
    // Verificar capacidad
    if (room.capacidad < numeroHuespedes) {
      throw new Error(`La habitación tiene capacidad para ${room.capacidad} personas, se solicitaron ${numeroHuespedes}`);
    }
    
    // Verificar disponibilidad para las fechas
    const isAvailable = await this.checkRoomAvailability(
      habitacionId, 
      fechaEntrada, 
      fechaSalida
    );
    
    if (!isAvailable) {
      throw new Error(`La habitación no está disponible para las fechas seleccionadas`);
    }
    
    // Calcular precio total
    const precioTotal = this.calculateTotalPrice(room, fechaEntrada, fechaSalida);
    
    // Crear datos de reserva
    const bookingData: CreateBookingData = {
      userId,
      habitacionId,
      fechaEntrada: new Date(fechaEntrada),
      fechaSalida: new Date(fechaSalida),
      numeroHuespedes,
      comentarios,
      precioTotal
    };
    
    // Crear reserva en la base de datos
    const booking = await bookingRepository.create(bookingData);
    
    return booking;
  }

  /**
   * Obtiene una reserva por su ID
   */
  async getBookingById(id: number | string) {
    return await bookingRepository.findById(id);
  }

  /**
   * Obtiene las reservas de un usuario
   */
  async getUserBookings(userId: string) {
    return await bookingRepository.findByUserId(userId);
  }

  /**
   * Actualiza el estado de una reserva
   */
  async updateBookingStatus(id: number | string, estado: BookingStatus) {
    return await bookingRepository.updateStatus(id, estado);
  }

  /**
   * Cancela una reserva
   */
  async cancelBooking(id: number | string, userId: string) {
    // Obtener la reserva
    const booking = await bookingRepository.findById(id);
    
    if (!booking) {
      throw new Error(`Reserva con ID ${id} no encontrada`);
    }
    
    // Verificar que la reserva pertenece al usuario
    if (booking.userId !== userId) {
      throw new Error('No tiene permiso para cancelar esta reserva');
    }
    
    // Verificar que la reserva no esté ya cancelada o completada
    if (booking.estado === BookingStatus.CANCELADA) {
      throw new Error('La reserva ya está cancelada');
    }
    
    if (booking.estado === BookingStatus.COMPLETADA) {
      throw new Error('No se puede cancelar una reserva completada');
    }
    
    // Actualizar estado a CANCELADA
    return await bookingRepository.updateStatus(id, BookingStatus.CANCELADA);
  }

  /**
   * Verifica la disponibilidad de una habitación para fechas específicas
   */
  async checkRoomAvailability(roomId: number | string, fechaEntrada: string, fechaSalida: string) {
    // Verificar que la habitación existe y está marcada como disponible
    const room = await roomRepository.findById(roomId);
    if (!room || !room.disponibilidad) {
      return false;
    }
    
    // Buscar reservas que se solapan
    const overlappingBookings = await bookingRepository.findOverlappingBookings(
      roomId, 
      new Date(fechaEntrada), 
      new Date(fechaSalida)
    );
    
    // La habitación está disponible si no hay reservas solapadas
    return overlappingBookings.length === 0;
  }

  /**
   * Calcula el precio total de una reserva basado en el precio por noche y la duración
   * @private
   */
  private calculateTotalPrice(room: Room, fechaEntrada: string, fechaSalida: string) {
    const startDate = new Date(fechaEntrada);
    const endDate = new Date(fechaSalida);
    
    // Calcular duración en milisegundos
    const duration = endDate.getTime() - startDate.getTime();
    
    // Convertir a días (1000ms * 60s * 60m * 24h)
    const days = Math.ceil(duration / (1000 * 60 * 60 * 24));
    
    // Multiplicar precio por noche por número de días
    return Number(room.precio) * days;
  }
}

export default new BookingService();