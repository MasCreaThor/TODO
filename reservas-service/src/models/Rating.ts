import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface RatingAttributes {
  id: number;
  hotelId: number;
  userId: string;
  puntuacion: number;
  comentario: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RatingInput extends Optional<RatingAttributes, 'id' | 'comentario'> {}
export interface RatingOutput extends Required<RatingAttributes> {}

class Rating extends Model<RatingAttributes, RatingInput> implements RatingAttributes {
  public id!: number;
  public hotelId!: number;
  public userId!: string;
  public puntuacion!: number;
  public comentario!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Rating.init(
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
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    puntuacion: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Rating',
    tableName: 'calificaciones',
  }
);

export default Rating;