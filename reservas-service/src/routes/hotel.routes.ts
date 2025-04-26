import express from 'express';
import { Router } from 'express';

const router: Router = express.Router();

// Implementaremos los controladores en la siguiente incidencia
router.get('/', (req, res) => {
  res.json({ message: 'Obtener todos los hoteles' });
});

router.get('/destacados', (req, res) => {
  res.json({ message: 'Obtener hoteles destacados' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Obtener hotel con ID: ${req.params.id}` });
});

export default router;