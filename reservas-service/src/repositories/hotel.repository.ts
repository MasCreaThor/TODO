// src/repositories/hotel.repository.ts
import { Op } from 'sequelize';
import { Hotel, Address, City, Country, Category, Room, Rating } from '../models';

/**
 * Interface para filtros de búsqueda de hoteles
 */
export interface HotelFilterCriteria {
  ciudad?: string;
  categoria?: number;
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
    const { ciudad, categoria, destacado, precioMin, precioMax } = criteria;
    
    // Construir condiciones de búsqueda
    const whereConditions: any = {};
    
    if (destacado !== undefined) {
      whereConditions.destacado = destacado;
    }
    
    if (categoria) {
      whereConditions.categoryId = categoria;
    }
    
    // Definir las relaciones a incluir
    return await Hotel.findAll({
      where: whereConditions,
      include: this.getStandardIncludes(ciudad, precioMin, precioMax)
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
  private getStandardIncludes(ciudad?: string, precioMin?: number, precioMax?: number) {
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
        as: 'categoria'
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
}

export default new HotelRepository();