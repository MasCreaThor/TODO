// src/routes/room.routes.ts
import express from 'express';
import { Router } from 'express';
import { getRoomById, getRoomsByHotelId, checkRoomAvailability } from '../controllers/room';

const router: Router = express.Router();

// Rutas implementadas con controladores reales
router.get('/hotel/:hotelId', getRoomsByHotelId);
router.get('/:id/availability', checkRoomAvailability);
router.get('/:id', getRoomById);

export default router;