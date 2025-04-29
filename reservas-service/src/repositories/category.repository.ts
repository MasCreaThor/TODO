// src/repositories/category.repository.ts
import { Category } from '../models';

/**
 * Repositorio para operaciones de acceso a datos de Categorías de Hoteles
 */
class CategoryRepository {
  /**
   * Obtiene todas las categorías
   */
  async findAll() {
    return await Category.findAll({
      order: [['estrellas', 'DESC']]
    });
  }

  /**
   * Encuentra una categoría por su ID
   */
  async findById(id: number | string) {
    return await Category.findByPk(id);
  }

  /**
   * Encuentra una categoría por el número de estrellas
   */
  async findByEstrellas(estrellas: number) {
    return await Category.findOne({
      where: { estrellas }
    });
  }

  /**
   * Crea una nueva categoría
   */
  async create(data: { nombre: string; estrellas: number; descripcion?: string }) {
    return await Category.create(data);
  }

  /**
   * Actualiza una categoría existente
   */
  async update(id: number | string, data: { nombre?: string; estrellas?: number; descripcion?: string }) {
    const category = await Category.findByPk(id);
    
    if (!category) {
      return null;
    }
    
    return await category.update(data);
  }
}

export default new CategoryRepository();