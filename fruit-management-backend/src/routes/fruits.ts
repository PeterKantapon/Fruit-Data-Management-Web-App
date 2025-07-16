import express from 'express';
import fruitController from '../controllers/fruitController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/fruits
router.get('/', fruitController.getAllFruits);

// POST /api/fruits
router.post('/', fruitController.createFruit);

// PUT /api/fruits/:id
router.put('/:id', fruitController.updateFruit);

// DELETE /api/fruits/:id
router.delete('/:id', fruitController.deleteFruit);

// GET /api/fruits/config/valid-fruits
router.get('/config/valid-fruits', fruitController.getValidFruits);

// GET /api/fruits/config/colors/:fruitName
router.get('/config/colors/:fruitName', fruitController.getColorsForFruit);

export default router;