import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CountryAttributes {
  id: number;
  nombre: string;
  codigo: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CountryInput extends Optional<CountryAttributes, 'id'> {}
export interface CountryOutput extends Required<CountryAttributes> {}

class Country extends Model<CountryAttributes, CountryInput> implements CountryAttributes {
  public id!: number;
  public nombre!: string;
  public codigo!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Country.init(
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
    codigo: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Country',
    tableName: 'paises',
  }
);

export default Country;