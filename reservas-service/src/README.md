# Arquitectura con Separación Completa de Responsabilidades

Hemos refactorizado la aplicación para implementar una arquitectura de capas con clara separación de responsabilidades siguiendo los principios SOLID y Clean Architecture:

## Capas y Responsabilidades

### 1. Controladores

**Responsabilidad**: Manejar peticiones HTTP y preparar respuestas.

```typescript
// Controller - Única responsabilidad: HTTP
export const getAllHotels = async (req: Request, res: Response) => {
  try {
    const filterOptions = {
      ciudad: req.query.ciudad as string,
      // Convertir parámetros...
    };
    
    const hotels = await hotelService.findAllHotels(filterOptions);
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Error', error });
  }
};
```

### 2. Servicios

**Responsabilidad**: Implementar lógica de negocio, orquestar operaciones.

```typescript
// Service - Lógica de negocio pura
class HotelService {
  async findAllHotels(filterOptions) {
    const hotels = await hotelRepository.findAll(filterOptions);
    return this.enrichHotelsWithRatings(hotels);
  }
  
  private calculateAverageRating(ratings) {
    // Lógica de cálculo
  }
}
```

### 3. Repositorios

**Responsabilidad**: Abstraer el acceso a datos y las consultas a la base de datos.

```typescript
// Repository - Acceso a datos
class HotelRepository {
  async findAll(criteria) {
    return await Hotel.findAll({
      where: this.buildWhereConditions(criteria),
      include: this.getStandardIncludes(criteria)
    });
  }
  
  private getStandardIncludes() {
    // Definición de relaciones
  }
}
```

### 4. Modelos

**Responsabilidad**: Definir la estructura de datos y operaciones a nivel de tabla.

## Principios Aplicados

### Principio de Responsabilidad Única (SRP)

Cada clase tiene una única razón para cambiar:

- **Controladores**: Cambian si cambia el formato de la API REST
- **Servicios**: Cambian si cambian las reglas de negocio
- **Repositorios**: Cambian si cambia la forma de acceder a los datos
- **Modelos**: Cambian si cambia la estructura de datos

### Principio de Inversión de Dependencias (DIP)

Los módulos de alto nivel no dependen de los detalles de implementación:

- Los servicios dependen de interfaces de repositorio, no de la implementación concreta
- Los controladores dependen de interfaces de servicio

### Principio de Segregación de Interfaces (ISP)

Cada clase expone solo los métodos necesarios para sus clientes:

- Los repositorios exponen operaciones de acceso a datos limpias
- Los servicios exponen operaciones de negocio cohesivas

## Ventajas de esta Arquitectura

### 1. Testabilidad Mejorada

- Se pueden probar las unidades de forma aislada con mocks
- Cada capa tiene una responsabilidad clara
- No hay dependencias de HTTP en la lógica de negocio

```typescript
// Test de servicio (fácil de mockear el repositorio)
test('should calculate average rating', () => {
  const mockRepository = { findById: jest.fn().mockResolvedValue(mockHotel) };
  const service = new HotelService(mockRepository);
  const result = await service.findHotelById(1);
  expect(result.calificacionPromedio).toBe(4.5);
});
```

### 2. Mantenibilidad Superior

- Código organizado por responsabilidad
- Cambios aislados a una sola capa
- Interfaces claras entre las capas

### 3. Escalabilidad Arquitectónica
- Fácil agregar nuevos repositorios o servicios
- Posibilidad de cambiar la base de datos sin afectar los servicios
- Posibilidad de cambiar de REST a GraphQL sin tocar los servicios

### 4. Reutilización de Código

- Lógica de negocio común centralizada en servicios
- Operaciones de acceso a datos comunes en repositorios
- No hay duplicación entre controladores

## Flujo de Datos

1. La solicitud HTTP llega a un controlador específico
2. El controlador extrae parámetros y llama al servicio apropiado
3. El servicio implementa lógica de negocio y llama a repositorios
4. El repositorio maneja la construcción de consultas y acceso a datos
5. El resultado fluye de vuelta a través de las capas

## Diagrama de Flujo

```m
Cliente ←→ Controlador ←→ Servicio ←→ Repositorio ←→ Modelo/Base de Datos
                  │             │             │
                  └─────────────┼─────────────┘
                                │
                          Flujo de datos
```

## Evolución Futura

Esta arquitectura facilita la introducción de:

1. **Contenedor de Inyección de Dependencias**: Para gestionar las instancias y sus dependencias
2. **Patrones CQRS**: Separar operaciones de lectura y escritura
3. **Value Objects y Entidades**: Para modelado más rico del dominio
4. **Eventos de dominio**: Para comunicación desacoplada entre servicios
5. **Middleware de validación**: Para validar de forma centralizada
6. **Caché**: Para mejorar el rendimiento de operaciones costosas
