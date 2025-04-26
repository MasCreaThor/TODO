import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AddressAttributes {
  id: number;
  calle: string;
  numero: string;
  codigoPostal: string;
  cityId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddressInput extends Optional<AddressAttributes, 'id'> {}
export interface AddressOutput extends Required<AddressAttributes> {}

class Address extends Model<AddressAttributes, AddressInput> implements AddressAttributes {
  public id!: number;
  public calle!: string;
  public numero!: string;
  public codigoPostal!: string;
  public cityId!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    calle: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    numero: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    codigoPostal: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ciudades',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Address',
    tableName: 'direcciones',
  }
);

export default Address;