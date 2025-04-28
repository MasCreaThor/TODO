import Hotel from './Hotel';
import Room from './Room';
import Booking, { BookingStatus } from './Booking';
import Country from './Country';
import City from './City';
import Address from './Address';
import Category from './Category';
import Rating from './Rating';

// Relaciones geográficas
Country.hasMany(City, {
  sourceKey: 'id',
  foreignKey: 'countryId',
  as: 'ciudades'
});

City.belongsTo(Country, {
  foreignKey: 'countryId',
  as: 'pais'
});

City.hasMany(Address, {
  sourceKey: 'id',
  foreignKey: 'cityId',
  as: 'direcciones'
});

Address.belongsTo(City, {
  foreignKey: 'cityId',
  as: 'ciudad'
});

// Relaciones de hotel
Address.hasMany(Hotel, {
  sourceKey: 'id',
  foreignKey: 'addressId',
  as: 'hoteles'
});

Hotel.belongsTo(Address, {
  foreignKey: 'addressId',
  as: 'direccion'
});

Category.hasMany(Hotel, {
  sourceKey: 'id',
  foreignKey: 'categoryId',
  as: 'hoteles'
});

Hotel.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'categoria'
});

// Relaciones de calificación
Hotel.hasMany(Rating, {
  sourceKey: 'id',
  foreignKey: 'hotelId',
  as: 'calificaciones'
});

Rating.belongsTo(Hotel, {
  foreignKey: 'hotelId',
  as: 'hotel'
});

// Relaciones de habitación y reserva
Hotel.hasMany(Room, {
  sourceKey: 'id',
  foreignKey: 'hotelId',
  as: 'habitaciones'
});

Room.belongsTo(Hotel, {
  foreignKey: 'hotelId',
  as: 'hotel'
});

Room.hasMany(Booking, {
  sourceKey: 'id',
  foreignKey: 'habitacionId',
  as: 'reservas'
});

Booking.belongsTo(Room, {
  foreignKey: 'habitacionId',
  as: 'habitacion'
});

export {
  Hotel,
  Room,
  Booking,
  BookingStatus,
  Country,
  City,
  Address,
  Category,
  Rating
};