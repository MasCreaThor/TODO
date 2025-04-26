import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface HotelAttributes {
  id: number;
  nombre: string;
  addressId: number;
  categoryId: number;
  destacado: boolean;
  descripcion: string;
  imagenes: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HotelInput extends Optional<HotelAttributes, 'id' | 'destacado' | 'descripcion' | 'imagenes'> {}
export interface HotelOutput extends Required<HotelAttributes> {}

class Hotel extends Model<HotelAttributes, HotelInput> implements HotelAttributes {
  public id!: number;
  public nombre!: string;
  public addressId!: number;
  public categoryId!: number;
  public destacado!: boolean;
  public descripcion!: string;
  public imagenes!: string[];

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Campos virtuales para relaciones
  public readonly address?: any;
  public readonly category?: any;
  public readonly ratings?: any[];
  public readonly habitaciones?: any[];
}

Hotel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    addressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'direcciones',
        key: 'id',
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categorias',
        key: 'id',
      },
    },
    destacado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imagenes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'Hotel',
    tableName: 'hoteles',
  }
);

export default Hotel;