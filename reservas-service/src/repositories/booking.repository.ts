// src/repositories/booking.repository.ts
import { Op } from 'sequelize';
import { Booking, BookingStatus, Room, Hotel } from '../models';

/**
 * Interface para crear una reserva
 */
export interface CreateBookingData {
  userId: string;
  habitacionId: number;
  fechaEntrada: Date;
  fechaSalida: Date;
  numeroHuespedes: number;
  comentarios?: string;
  precioTotal?: number;
}

/**
 * Repositorio para operaciones de acceso a datos de Reservas
 */
class BookingRepository {
  /**
   * Crea una nueva reserva
   */
  async create(bookingData: CreateBookingData) {
    // La reserva se crea con estado PENDIENTE por defecto
    return await Booking.create({
      ...bookingData,
      estado: BookingStatus.PENDIENTE
    });
  }

  /**
   * Encuentra una reserva por su ID
   */
  async findById(id: number | string) {
    return await Booking.findByPk(id, {
      include: [
        {
          model: Room,
          as: 'habitacion',
          include: [
            {
              model: Hotel,
              as: 'hotel'
            }
          ]
        }
      ]
    });
  }

  /**
   * Encuentra reservas por ID de usuario
   */
  async findByUserId(userId: string) {
    return await Booking.findAll({
      where: {
        userId
      },
      include: [
        {
          model: Room,
          as: 'habitacion',
          include: [
            {
              model: Hotel,
              as: 'hotel'
            }
          ]
        }
      ],
      order: [
        ['fechaEntrada', 'DESC'] // Ordenar por fecha de entrada descendente
      ]
    });
  }

  /**
   * Encuentra reservas por ID de habitación
   */
  async findByRoomId(roomId: number | string) {
    return await Booking.findAll({
      where: {
        habitacionId: roomId
      },
      include: [
        {
          model: Room,
          as: 'habitacion'
        }
      ]
    });
  }

  /**
   * Actualiza el estado de una reserva
   */
  async updateStatus(id: number | string, estado: BookingStatus) {
    const booking = await Booking.findByPk(id);
    
    if (!booking) {
      return null;
    }
    
    booking.estado = estado;
    await booking.save();
    
    return booking;
  }

  /**
   * Verifica si existen reservas que se solapan para una habitación en un período de fechas
   */
  async findOverlappingBookings(roomId: number | string, fechaEntrada: Date | string, fechaSalida: Date | string) {
    // Convertir string a Date si es necesario
    const startDate = typeof fechaEntrada === 'string' ? new Date(fechaEntrada) : fechaEntrada;
    const endDate = typeof fechaSalida === 'string' ? new Date(fechaSalida) : fechaSalida;
    
    return await Booking.findAll({
      where: {
        habitacionId: roomId,
        estado: {
          [Op.notIn]: [BookingStatus.CANCELADA]
        },
        [Op.or]: [
          {
            // Caso 1: fechaEntrada está entre fechaEntrada y fechaSalida de una reserva existente
            fechaEntrada: {
              [Op.lte]: startDate
            },
            fechaSalida: {
              [Op.gte]: startDate
            }
          },
          {
            // Caso 2: fechaSalida está entre fechaEntrada y fechaSalida de una reserva existente
            fechaEntrada: {
              [Op.lte]: endDate
            },
            fechaSalida: {
              [Op.gte]: endDate
            }
          },
          {
            // Caso 3: fechaEntrada y fechaSalida abarcan completamente una reserva existente
            fechaEntrada: {
              [Op.gte]: startDate
            },
            fechaSalida: {
              [Op.lte]: endDate
            }
          }
        ]
      }
    });
  }
}

export default new BookingRepository();