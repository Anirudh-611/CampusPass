import express from 'express';
import { verifyCard } from '../controllers/verifyController.js';

const router = express.Router();

// Public Edge Verification Route (Zero Auth Required)
router.get('/:verificationId', verifyCard);

export default router;

