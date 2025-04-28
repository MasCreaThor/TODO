// src/routes/hotel.routes.ts
import express from 'express';
import { Router } from 'express';
import { getAllHotels, getHotelById, getDestacadosHotels } from '../controllers/hotel';

const router: Router = express.Router();

// Rutas implementadas con controladores reales
router.get('/', getAllHotels);
router.get('/destacados', getDestacadosHotels);
router.get('/:id', getHotelById);

export default router;