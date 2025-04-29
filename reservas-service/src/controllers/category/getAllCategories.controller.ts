// src/controllers/category/getAllCategories.controller.ts
import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../../services';

/**
 * Controlador para obtener todas las categorías de hoteles
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Utilizar el servicio para obtener todas las categorías
    const categories = await categoryService.getAllCategories();
    
    // Enviar respuesta - No retornar el resultado de res.json()
    res.json(categories);
  } catch (error) {
    // Usar next(error) en lugar de manejar el error aquí
    next(error);
  }
};

export default getAllCategories;