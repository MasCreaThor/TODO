// src/services/category/category.service.ts
import categoryRepository from '../../repositories/category.repository';

/**
 * Servicio dedicado a la lógica de negocio relacionada con categorías de hoteles
 */
class CategoryService {
  /**
   * Obtiene todas las categorías de hoteles
   */
  async getAllCategories() {
    return await categoryRepository.findAll();
  }

  /**
   * Obtiene una categoría por su ID
   */
  async getCategoryById(id: number | string) {
    return await categoryRepository.findById(id);
  }

  /**
   * Obtiene o crea una categoría según el número de estrellas
   * Útil para cuando el frontend envía estrellas en lugar de ID
   */
  async findOrCreateByEstrellas(estrellas: number) {
    // Validar que estrellas esté entre 1 y 5
    if (estrellas < 1 || estrellas > 5) {
      throw new Error('El número de estrellas debe estar entre 1 y 5');
    }
    
    // Buscar categoría existente
    let category = await categoryRepository.findByEstrellas(estrellas);
    
    // Si no existe, crear una nueva categoría
    if (!category) {
      const nombres = {
        1: 'Económico',
        2: 'Turista',
        3: 'Estándar',
        4: 'Superior',
        5: 'Lujo'
      };
      
      category = await categoryRepository.create({
        nombre: nombres[estrellas as keyof typeof nombres],
        estrellas,
        descripcion: `Hotel ${estrellas} estrellas`
      });
    }
    
    return category;
  }

  /**
   * Valida si una categoría existe
   */
  async validateCategory(categoryId: number | string) {
    const category = await categoryRepository.findById(categoryId);
    return !!category;
  }
}

export default new CategoryService();