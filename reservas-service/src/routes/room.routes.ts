import express from 'express';
import { Router } from 'express';

const router: Router = express.Router();

// Implementaremos los controladores en la siguiente incidencia
router.get('/', (req, res) => {
  res.json({ message: 'Obtener todas las habitaciones' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Obtener habitación con ID: ${req.params.id}` });
});

router.get('/hotel/:hotelId', (req, res) => {
  res.json({ message: `Obtener habitaciones del hotel con ID: ${req.params.hotelId}` });
});

export default router;