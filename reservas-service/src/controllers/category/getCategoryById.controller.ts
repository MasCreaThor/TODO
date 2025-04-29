// src/controllers/category/getCategoryById.controller.ts
import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../../services';

/**
 * Controlador para obtener una categoría específica por ID
 * @param req Request - Debe incluir param: id
 * @param res Response
 * @param next NextFunction
 */
export const getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Utilizar el servicio para buscar la categoría
    const category = await categoryService.getCategoryById(id);
    
    // Verificar si la categoría existe
    if (!category) {
      res.status(404).json({ message: `Categoría con ID ${id} no encontrada` });
      return;
    }
    
    // Enviar respuesta - No retornar el resultado de res.json()
    res.json(category);
  } catch (error) {
    // Usar next(error) en lugar de manejar el error aquí
    next(error);
  }
};

export default getCategoryById;