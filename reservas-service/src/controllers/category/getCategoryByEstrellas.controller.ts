// src/controllers/category/getCategoryByEstrellas.controller.ts
import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../../services';

/**
 * Controlador para obtener o crear una categoría según el número de estrellas
 * @param req Request - Debe incluir param: estrellas (1-5)
 * @param res Response
 * @param next NextFunction
 */
export const getCategoryByEstrellas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const estrellas = parseInt(req.params.estrellas);
    
    // Validar que estrellas es un número entre 1 y 5
    if (isNaN(estrellas) || estrellas < 1 || estrellas > 5) {
      res.status(400).json({ 
        message: 'El número de estrellas debe ser un número entre 1 y 5' 
      });
      return;
    }
    
    // Utilizar el servicio para buscar o crear la categoría
    const category = await categoryService.findOrCreateByEstrellas(estrellas);
    
    // Enviar respuesta - No retornar el resultado de res.json()
    res.json(category);
  } catch (error) {
    // Usar next(error) en lugar de manejar el error aquí
    next(error);
  }
};

export default getCategoryByEstrellas;