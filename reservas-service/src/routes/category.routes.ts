// src/routes/category.routes.ts
import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  getCategoryByEstrellas
} from '../controllers/category';

const router = express.Router();

// Rutas públicas - Importante: la ruta específica va ANTES de la ruta con parámetro genérico
router.get('/estrellas/:estrellas', getCategoryByEstrellas);
router.get('/:id', getCategoryById);
router.get('/', getAllCategories);

export default router;