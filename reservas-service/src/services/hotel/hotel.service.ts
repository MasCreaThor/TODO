// src/services/hotel/hotel.service.ts
import { hotelRepository } from '../../repositories';
import { categoryService } from '../category';
import { HotelFilterCriteria } from '../../repositories/hotel.repository';

/**
 * Interfaz para las opciones de filtrado de hoteles (a nivel de servicio)
 */
export interface HotelFilterOptions extends Omit<HotelFilterCriteria, 'estrellas'> {
  estrellas?: number; // Número de estrellas (1-5)
}

/**
 * Servicio dedicado a la lógica de negocio relacionada con hoteles
 */
class HotelService {
  /**
   * Obtiene todos los hoteles con opciones de filtrado
   */
  async findAllHotels(filterOptions: HotelFilterOptions = {}) {
    const { estrellas, ...otherFilters } = filterOptions;
    
    // Transformar filtros si es necesario
    let repositoryFilters: HotelFilterCriteria = { ...otherFilters };
    
    // Si se proporciona estrellas pero no categoría, intentar encontrar categoría correspondiente
    if (estrellas && !filterOptions.categoria) {
      try {
        const category = await categoryService.findOrCreateByEstrellas(estrellas);
        if (category) {
          repositoryFilters.categoria = category.id;
        }
      } catch (error) {
        console.warn('No se pudo encontrar categoría por estrellas:', error);
        // Usar estrellas como filtro directo si no se puede encontrar categoría
        repositoryFilters.estrellas = estrellas;
      }
    }
    
    const hotels = await hotelRepository.findAll(repositoryFilters);
    return this.enrichHotelsWithRatings(hotels);
  }

  /**
   * Obtiene un hotel específico por su ID
   */
  async findHotelById(id: number | string) {
    const hotel = await hotelRepository.findById(id);
    if (!hotel) return null;
    return this.enrichHotelWithRating(hotel);
  }

  /**
   * Obtiene los hoteles destacados
   */
  async findDestacadosHotels(limit: number = 6) {
    const hotels = await hotelRepository.findDestacados(limit);
    return this.enrichHotelsWithRatings(hotels);
  }

  /**
   * Obtiene todos los hoteles con detalles completos de categoría
   * Útil para dashboard y vistas detalladas
   */
  async findHotelsWithFullDetails(limit?: number) {
    const hotels = await hotelRepository.findWithCategoryDetails(limit);
    return this.enrichHotelsWithRatings(hotels);
  }

  /**
   * Calcula la calificación promedio de un hotel
   * @private
   */
  private calculateAverageRating(ratings: any[]) {
    if (!ratings || ratings.length === 0) {
      return 0;
    }
    
    const totalRating = ratings.reduce(
      (sum: number, rating: any) => sum + rating.puntuacion, 
      0
    );
    
    return totalRating / ratings.length;
  }

  /**
   * Enriquece múltiples hoteles con calificaciones promedio
   * @private
   */
  private enrichHotelsWithRatings(hotels: any[]) {
    return hotels.map(hotel => this.enrichHotelWithRating(hotel));
  }

  /**
   * Enriquece un hotel con su calificación promedio
   * @private
   */
  private enrichHotelWithRating(hotel: any) {
    const hotelData = hotel.toJSON();
    
    if (hotelData.calificaciones && hotelData.calificaciones.length > 0) {
      hotelData.calificacionPromedio = this.calculateAverageRating(hotelData.calificaciones);
    } else {
      hotelData.calificacionPromedio = 0;
    }
    
    // Asegurar que la información de categoría tenga el formato esperado
    if (hotelData.categoria) {
      hotelData.categoria = {
        id: hotelData.categoria.id,
        nombre: hotelData.categoria.nombre,
        estrellas: hotelData.categoria.estrellas,
        descripcion: hotelData.categoria.descripcion
      };
    }
    
    return hotelData;
  }
}

export default new HotelService();