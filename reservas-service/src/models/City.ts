import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CityAttributes {
  id: number;
  nombre: string;
  countryId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CityInput extends Optional<CityAttributes, 'id'> {}
export interface CityOutput extends Required<CityAttributes> {}

class City extends Model<CityAttributes, CityInput> implements CityAttributes {
  public id!: number;
  public nombre!: string;
  public countryId!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

City.init(
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
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'paises',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'City',
    tableName: 'ciudades',
  }
);

export default City;