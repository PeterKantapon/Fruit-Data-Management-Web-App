import express from 'express';
import authController from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me (protected)
router.get('/me', authMiddleware, authController.me);

export default router;