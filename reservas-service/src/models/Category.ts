import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CategoryAttributes {
  id: number;
  nombre: string;
  estrellas: number;
  descripcion: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryInput extends Optional<CategoryAttributes, 'id' | 'descripcion'> {}
export interface CategoryOutput extends Required<CategoryAttributes> {}

class Category extends Model<CategoryAttributes, CategoryInput> implements CategoryAttributes {
  public id!: number;
  public nombre!: string;
  public estrellas!: number;
  public descripcion!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    estrellas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categorias',
  }
);

export default Category;