import express from 'express';
import {
  getDashboardStats,
  getAllCards,
  getAllStudents,
  approveCard,
  rejectCard,
  revokeCard,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All admin routes strictly enforce admin role authorization
router.use(protect);
router.use(restrictTo('admin'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/cards', getAllCards);
router.get('/students', getAllStudents);
router.patch('/cards/:id/approve', approveCard);
router.patch('/cards/:id/reject', rejectCard);
router.patch('/cards/:id/revoke', revokeCard);

export default router;

