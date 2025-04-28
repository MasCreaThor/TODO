// src/config/seeders.ts
import { 
    Country, 
    City, 
    Address, 
    Category, 
    Hotel, 
    Room 
  } from '../models';
  
  /**
   * Inserta datos iniciales en la base de datos para pruebas
   */
  export const seedDatabase = async () => {
    try {
      console.log('Verificando si existen datos iniciales...');
      
      // Verificar si ya existen datos
      const hotelCount = await Hotel.count();
      
      if (hotelCount > 0) {
        console.log('La base de datos ya contiene datos. No se insertarán datos de prueba.');
        return;
      }
      
      console.log('Insertando datos iniciales...');
      
      // 1. Crear países
      const argentina = await Country.create({
        nombre: 'Argentina',
        codigo: 'AR'
      });
      
      const colombia = await Country.create({
        nombre: 'Colombia',
        codigo: 'CO'
      });
      
      // 2. Crear ciudades
      const buenosAires = await City.create({
        nombre: 'Buenos Aires',
        countryId: argentina.id
      });
      
      const bogota = await City.create({
        nombre: 'Bogotá',
        countryId: colombia.id
      });
      
      // 3. Crear direcciones
      const direccionBuenosAires = await Address.create({
        calle: 'Av. 9 de Julio',
        numero: '1000',
        codigoPostal: '1043',
        cityId: buenosAires.id
      });
      
      const direccionBogota = await Address.create({
        calle: 'Carrera 7',
        numero: '72-41',
        codigoPostal: '110231',
        cityId: bogota.id
      });
      
      // 4. Crear categorías
      const lujo = await Category.create({
        nombre: 'Lujo',
        estrellas: 5,
        descripcion: 'Hoteles de lujo con todas las comodidades'
      });
      
      const estandar = await Category.create({
        nombre: 'Estándar',
        estrellas: 3,
        descripcion: 'Hoteles con buena relación calidad-precio'
      });
      
      // 5. Crear hoteles
      const hotelBuenosAires = await Hotel.create({
        nombre: 'Grand Hotel Buenos Aires',
        addressId: direccionBuenosAires.id,
        categoryId: lujo.id,
        destacado: true,
        descripcion: 'Ubicado en el centro de Buenos Aires, con vistas espectaculares a la ciudad',
        imagenes: ['https://ejemplo.com/hotel1-1.jpg', 'https://ejemplo.com/hotel1-2.jpg']
      });
      
      const hotelBogota = await Hotel.create({
        nombre: 'Bogotá Premium Hotel',
        addressId: direccionBogota.id,
        categoryId: estandar.id,
        destacado: false,
        descripcion: 'Ubicado en la zona financiera de Bogotá, ideal para viajes de negocios',
        imagenes: ['https://ejemplo.com/hotel2-1.jpg', 'https://ejemplo.com/hotel2-2.jpg']
      });
      
      // 6. Crear habitaciones
      await Room.create({
        hotelId: hotelBuenosAires.id,
        tipo: 'Suite Presidencial',
        capacidad: 2,
        precio: 500,
        disponibilidad: true,
        imagenes: ['https://ejemplo.com/habitacion1-1.jpg', 'https://ejemplo.com/habitacion1-2.jpg'],
        descripcion: 'Suite de lujo con vista panorámica a la ciudad',
        amenities: ['Jacuzzi', 'Minibar', 'Wi-Fi', 'TV 65"', 'Servicio al cuarto 24/7']
      });
      
      await Room.create({
        hotelId: hotelBuenosAires.id,
        tipo: 'Habitación Doble',
        capacidad: 2,
        precio: 250,
        disponibilidad: true,
        imagenes: ['https://ejemplo.com/habitacion2-1.jpg', 'https://ejemplo.com/habitacion2-2.jpg'],
        descripcion: 'Habitación confortable con dos camas individuales',
        amenities: ['Wi-Fi', 'TV 42"', 'Minibar']
      });
      
      await Room.create({
        hotelId: hotelBogota.id,
        tipo: 'Habitación Individual',
        capacidad: 1,
        precio: 120,
        disponibilidad: true,
        imagenes: ['https://ejemplo.com/habitacion3-1.jpg', 'https://ejemplo.com/habitacion3-2.jpg'],
        descripcion: 'Habitación individual con todas las comodidades necesarias',
        amenities: ['Wi-Fi', 'TV 32"', 'Escritorio de trabajo']
      });
      
      await Room.create({
        hotelId: hotelBogota.id,
        tipo: 'Suite Junior',
        capacidad: 2,
        precio: 180,
        disponibilidad: true,
        imagenes: ['https://ejemplo.com/habitacion4-1.jpg', 'https://ejemplo.com/habitacion4-2.jpg'],
        descripcion: 'Suite con sala de estar y dormitorio separados',
        amenities: ['Wi-Fi', 'TV 50"', 'Minibar', 'Sofá-cama']
      });
      
      console.log('Datos de prueba insertados correctamente!');
      
      // Mostrar IDs de las habitaciones creadas para facilitar pruebas
      const rooms = await Room.findAll({ attributes: ['id', 'tipo', 'hotelId'] });
      console.log('Habitaciones disponibles para pruebas:');
      rooms.forEach(room => {
        console.log(`ID: ${room.id}, Tipo: ${room.tipo}, Hotel ID: ${room.hotelId}`);
      });
      
    } catch (error) {
      console.error('Error al insertar datos de prueba:', error);
      throw error;
    }
  };