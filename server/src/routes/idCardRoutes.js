import express from 'express';
import { applyForCard, getMyCard } from '../controllers/idCardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/apply', restrictTo('student'), applyForCard);
router.get('/my-card', restrictTo('student'), getMyCard);

export default router;

