import express from 'express';
import { Router } from 'express';

const router: Router = express.Router();

// Implementaremos los controladores en la siguiente incidencia
router.get('/', (req, res) => {
  res.json({ message: 'Obtener todas las reservas' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Obtener reserva con ID: ${req.params.id}` });
});

router.post('/', (req, res) => {
  res.json({ message: 'Crear nueva reserva' });
});

export default router;