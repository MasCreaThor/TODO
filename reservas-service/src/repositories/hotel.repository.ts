// src/repositories/hotel.repository.ts
import { Op } from 'sequelize';
import { Hotel, Address, City, Country, Category, Room, Rating } from '../models';

/**
 * Interface para filtros de búsqueda de hoteles
 */
export interface HotelFilterCriteria {
  ciudad?: string;
  categoria?: number;  // ID de la categoría
  estrellas?: number;  // Número de estrellas (alternativa a categoryId)
  destacado?: boolean;
  precioMin?: number;
  precioMax?: number;
}

/**
 * Repositorio para operaciones de acceso a datos de Hoteles
 */
class HotelRepository {
  /**
   * Encuentra todos los hoteles que coincidan con los criterios de filtro
   */
  async findAll(criteria: HotelFilterCriteria = {}) {
    const { ciudad, categoria, estrellas, destacado, precioMin, precioMax } = criteria;
    
    // Construir condiciones de búsqueda
    const whereConditions: any = {};
    
    if (destacado !== undefined) {
      whereConditions.destacado = destacado;
    }
    
    // Preparar condiciones para Category
    let categoryWhere = {};
    if (categoria) {
      // Si se proporciona ID de categoría
      whereConditions.categoryId = categoria;
    }
    
    if (estrellas) {
      // Si se proporciona número de estrellas
      categoryWhere = { 
        ...categoryWhere,
        estrellas 
      };
    }
    
    // Definir las relaciones a incluir
    return await Hotel.findAll({
      where: whereConditions,
      include: this.getStandardIncludes(ciudad, precioMin, precioMax, categoryWhere)
    });
  }

  /**
   * Encuentra un hotel específico por su ID
   */
  async findById(id: number | string) {
    return await Hotel.findByPk(id, {
      include: this.getStandardIncludes()
    });
  }

  /**
   * Encuentra hoteles destacados
   */
  async findDestacados(limit: number = 6) {
    return await Hotel.findAll({
      where: {
        destacado: true
      },
      include: this.getStandardIncludes(),
      limit
    });
  }

  /**
   * Devuelve un arreglo con las relaciones estándar para incluir en las consultas
   */
  private getStandardIncludes(ciudad?: string, precioMin?: number, precioMax?: number, categoryWhere: any = {}) {
    return [
      {
        model: Address,
        as: 'direccion',
        include: [
          {
            model: City,
            as: 'ciudad',
            where: ciudad ? { nombre: { [Op.iLike]: `%${ciudad}%` } } : undefined,
            include: [
              {
                model: Country,
                as: 'pais'
              }
            ]
          }
        ]
      },
      {
        model: Category,
        as: 'categoria',
        where: Object.keys(categoryWhere).length > 0 ? categoryWhere : undefined
      },
      {
        model: Rating,
        as: 'calificaciones',
        required: false
      },
      {
        model: Room,
        as: 'habitaciones',
        where: precioMin || precioMax ? {
          precio: {
            ...(precioMin && { [Op.gte]: precioMin }),
            ...(precioMax && { [Op.lte]: precioMax })
          }
        } : undefined,
        required: !!(precioMin || precioMax)
      }
    ];
  }

  /**
   * Busca hoteles con datos de categoría enriquecidos
   * Útil para dashboards y listados detallados
   */
  async findWithCategoryDetails(limit?: number) {
    const options: any = {
      include: this.getStandardIncludes(),
      order: [['destacado', 'DESC'], ['id', 'ASC']]
    };
    
    if (limit) {
      options.limit = limit;
    }
    
    return await Hotel.findAll(options);
  }
}

export default new HotelRepository();