import { Router } from 'express';
import { importCSV, uploadMiddleware } from '../controllers/csvController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/import', uploadMiddleware, importCSV);

export default router;