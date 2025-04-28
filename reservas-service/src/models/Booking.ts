import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Room from './Room';

export enum BookingStatus {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
  CANCELADA = 'CANCELADA',
  COMPLETADA = 'COMPLETADA',
}

interface BookingAttributes {
  id: number;
  userId: string;
  habitacionId: number;
  fechaEntrada: Date;
  fechaSalida: Date;
  estado: BookingStatus;
  precioTotal: number;
  numeroHuespedes: number;
  comentarios: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookingInput extends Optional<BookingAttributes, 'id' | 'estado' | 'precioTotal' | 'comentarios'> {}
export interface BookingOutput extends Required<BookingAttributes> {}

class Booking extends Model<BookingAttributes, BookingInput> implements BookingAttributes {
  public id!: number;
  public userId!: string;
  public habitacionId!: number;
  public fechaEntrada!: Date;
  public fechaSalida!: Date;
  public estado!: BookingStatus;
  public precioTotal!: number;
  public numeroHuespedes!: number;
  public comentarios!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    habitacionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'habitaciones',
        key: 'id',
      },
    },
    fechaEntrada: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fechaSalida: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM(...Object.values(BookingStatus)),
      defaultValue: BookingStatus.PENDIENTE,
    },
    precioTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    numeroHuespedes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    comentarios: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Booking',
    tableName: 'reservas',
  }
);

export default Booking;