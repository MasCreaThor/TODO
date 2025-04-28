// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// URL del servicio de autenticación
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:8080';

// Interfaz para extender Request con el usuario
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

/**
 * Middleware para verificar el token JWT y extraer información del usuario
 */
export const authMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  // Extraer el token del header de autorización
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    return;
  }
  
  const token = authHeader.substring(7);
  
  // Validar el token con el servicio de autenticación
  fetch(`${AUTH_SERVICE_URL}/api/auth/validate-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': `Bearer ${token}`
    },
    body: token
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Token inválido o expirado');
    }
    return response.json();
  })
  .then(isValid => {
    if (!isValid) {
      throw new Error('Token inválido o expirado');
    }
    
    // Decodificar el token para obtener el ID del usuario y su rol
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Token malformado');
    }
    
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    
    // Adjuntar información del usuario al objeto request
    req.userId = payload.id || payload.sub;
    req.userRole = payload.role;
    
    // Continuar con la siguiente función en la cadena de middleware
    next();
  })
  .catch(error => {
    console.error('Error al validar token JWT:', error);
    res.status(401).json({ message: 'Error de autenticación', error: error.message });
  });
};

/**
 * Middleware para verificar que el usuario tiene un rol específico
 */
export const hasRole = (roles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Verificar que el middleware de autenticación se ejecutó primero
    if (!req.userId || !req.userRole) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }
    
    // Verificar que el usuario tiene uno de los roles permitidos
    if (!roles.includes(req.userRole)) {
      res.status(403).json({ 
        message: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}` 
      });
      return;
    }
    
    // Continuar con la siguiente función en la cadena de middleware
    next();
  };
};