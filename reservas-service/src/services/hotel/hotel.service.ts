// src/services/hotel/hotel.service.ts
import { hotelRepository } from '../../repositories';
import { HotelFilterCriteria } from '../../repositories/hotel.repository';

/**
 * Interfaz para las opciones de filtrado de hoteles (a nivel de servicio)
 */
export interface HotelFilterOptions extends HotelFilterCriteria {}

/**
 * Servicio dedicado a la lógica de negocio relacionada con hoteles
 */
class HotelService {
  /**
   * Obtiene todos los hoteles con opciones de filtrado
   */
  async findAllHotels(filterOptions: HotelFilterOptions = {}) {
    const hotels = await hotelRepository.findAll(filterOptions);
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
    
    return hotelData;
  }
}

export default new HotelService();