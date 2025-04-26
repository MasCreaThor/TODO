import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Hotel from './Hotel';

interface RoomAttributes {
  id: number;
  hotelId: number;
  tipo: string;
  capacidad: number;
  precio: number;
  disponibilidad: boolean;
  imagenes: string[];
  descripcion: string;
  amenities: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoomInput extends Optional<RoomAttributes, 'id'> {}
export interface RoomOutput extends Required<RoomAttributes> {}

class Room extends Model<RoomAttributes, RoomInput> implements RoomAttributes {
  public id!: number;
  public hotelId!: number;
  public tipo!: string;
  public capacidad!: number;
  public precio!: number;
  public disponibilidad!: boolean;
  public imagenes!: string[];
  public descripcion!: string;
  public amenities!: string[];

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Room.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hotelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hoteles',
        key: 'id',
      },
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    disponibilidad: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    imagenes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    amenities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'Room',
    tableName: 'habitaciones',
  }
);

export default Room;