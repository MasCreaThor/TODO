# Pruebas con Postman - Endpoints Protegidos de Reservas

Esta guía describe cómo probar los nuevos endpoints protegidos del microservicio de Reservas utilizando Postman.

## Requisitos Previos

1. Tener Postman instalado
2. Tener los microservicios Auth y Reservas ejecutándose
3. Tener un usuario registrado y su token JWT

## Obtener un Token JWT

Antes de probar los endpoints protegidos, necesitas obtener un token JWT:

1. **Iniciar sesión** usando la API GraphQL del API Gateway:

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    refreshToken
    user {
      id
      email
      role {
        name
      }
    }
  }
}
```

Variables:

```json
{
  "input": {
    "email": "tu_email@ejemplo.com",
    "password": "tu_contraseña"
  }
}
```

2.**Copiar el token JWT** de la respuesta para usarlo en las solicitudes al microservicio de Reservas.

## Configuración de la Colección de Postman

Para facilitar las pruebas, configura variables de entorno en Postman:

1. Crea un nuevo entorno y añade estas variables:
   - `base_url`: `http://localhost:3000` (URL del microservicio Reservas)
   - `token`: [Pega aquí el token JWT obtenido]

2. Establece este entorno como activo.

## Prueba 1: Crear una Reserva

**Método**: POST  
**URL**: `{{base_url}}/api/bookings`  
**Headers**:

- `Content-Type`: `application/json`
- `Authorization`: `Bearer {{token}}`

**Body**:

```json
{
  "habitacionId": 1,
  "fechaEntrada": "2025-05-01",
  "fechaSalida": "2025-05-05",
  "numeroHuespedes": 2,
  "comentarios": "Por favor, habitación con vista al mar si es posible."
}
```

**Respuesta Exitosa** (Código 201):

```json
{
  "id": 1,
  "userId": "usuario_id_aquí",
  "habitacionId": 1,
  "fechaEntrada": "2025-05-01T00:00:00.000Z",
  "fechaSalida": "2025-05-05T00:00:00.000Z",
  "estado": "PENDIENTE",
  "precioTotal": 800,
  "numeroHuespedes": 2,
  "comentarios": "Por favor, habitación con vista al mar si es posible.",
  "createdAt": "2023-04-25T12:34:56.789Z",
  "updatedAt": "2023-04-25T12:34:56.789Z"
}
```

## Prueba 2: Obtener Reservas del Usuario

**Método**: GET  
**URL**: `{{base_url}}/api/bookings/user`  
**Headers**:

- `Authorization`: `Bearer {{token}}`

**Respuesta Exitosa** (Código 200):

```json
[
  {
    "id": 1,
    "userId": "usuario_id_aquí",
    "habitacionId": 1,
    "fechaEntrada": "2025-05-01T00:00:00.000Z",
    "fechaSalida": "2025-05-05T00:00:00.000Z",
    "estado": "PENDIENTE",
    "precioTotal": 800,
    "numeroHuespedes": 2,
    "comentarios": "Por favor, habitación con vista al mar si es posible.",
    "createdAt": "2023-04-25T12:34:56.789Z",
    "updatedAt": "2023-04-25T12:34:56.789Z",
    "habitacion": {
      "id": 1,
      "hotelId": 1,
      "tipo": "Suite",
      "capacidad": 2,
      "precio": 200,
      "disponibilidad": true,
      "imagenes": ["url1", "url2"],
      "descripcion": "Suite de lujo con vista al mar",
      "hotel": {
        "id": 1,
        "nombre": "Hotel Ejemplo",
        "direccion": "Dirección Ejemplo"
      }
    }
  }
]
```

## Prueba 3: Obtener una Reserva Específica

**Método**: GET  
**URL**: `{{base_url}}/api/bookings/1` (Reemplaza 1 con el ID de la reserva)  
**Headers**:

- `Authorization`: `Bearer {{token}}`

**Respuesta Exitosa** (Código 200):

```json
{
  "id": 1,
  "userId": "usuario_id_aquí",
  "habitacionId": 1,
  "fechaEntrada": "2025-05-01T00:00:00.000Z",
  "fechaSalida": "2025-05-05T00:00:00.000Z",
  "estado": "PENDIENTE",
  "precioTotal": 800,
  "numeroHuespedes": 2,
  "comentarios": "Por favor, habitación con vista al mar si es posible.",
  "createdAt": "2023-04-25T12:34:56.789Z",
  "updatedAt": "2023-04-25T12:34:56.789Z",
  "habitacion": {
    "id": 1,
    "hotelId": 1,
    "tipo": "Suite",
    "capacidad": 2,
    "precio": 200,
    "disponibilidad": true,
    "imagenes": ["url1", "url2"],
    "descripcion": "Suite de lujo con vista al mar",
    "hotel": {
      "id": 1,
      "nombre": "Hotel Ejemplo",
      "direccion": "Dirección Ejemplo"
    }
  }
}
```

## Prueba 4: Cancelar una Reserva

**Método**: PUT  
**URL**: `{{base_url}}/api/bookings/1/cancel` (Reemplaza 1 con el ID de la reserva)  
**Headers**:

- `Authorization`: `Bearer {{token}}`

**Respuesta Exitosa** (Código 200):

```json
{
  "id": 1,
  "userId": "usuario_id_aquí",
  "habitacionId": 1,
  "fechaEntrada": "2025-05-01T00:00:00.000Z",
  "fechaSalida": "2025-05-05T00:00:00.000Z",
  "estado": "CANCELADA",
  "precioTotal": 800,
  "numeroHuespedes": 2,
  "comentarios": "Por favor, habitación con vista al mar si es posible.",
  "createdAt": "2023-04-25T12:34:56.789Z",
  "updatedAt": "2023-04-25T13:45:00.000Z"
}
```

## Solución de Problemas Comunes

### Error 401: No se proporcionó token de autenticación

- **Causa**: Falta el header `Authorization` o el token es incorrecto.
- **Solución**: Asegúrate de incluir el header `Authorization: Bearer <token>` y que el token sea válido.

### Error 400: La habitación no está disponible

- **Causa**: La habitación ya está reservada para las fechas solicitadas.
- **Solución**: Prueba con otras fechas o una habitación diferente.

### Error 403: No tiene permiso para ver esta reserva

- **Causa**: Estás intentando acceder a una reserva que no te pertenece.
- **Solución**: Asegúrate de solicitar solo tus propias reservas a menos que tengas rol de ADMIN o HOTEL_MANAGER.

### Error 500: Error del servidor

- **Causa**: Problema interno en el servidor.
- **Solución**: Verifica los logs del servidor para más detalles.

## Notas Adicionales

- Para crear una reserva, asegúrate de que la habitación existe y está disponible para las fechas solicitadas.
- Las fechas deben estar en formato ISO (YYYY-MM-DD).
- No puedes cancelar una reserva ya completada.
- El precio total se calcula automáticamente basado en el precio por noche y la duración de la estancia.

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
