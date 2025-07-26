

import express from 'express';
import {
  importTransactions,
  getTransactions,
  analyzeSpending,
  setBudget,
  getBudget,
  exportTransactions,
  clearTransactions,
  getRecommendations
} from '../controllers/transactionController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();



router.post('/import', authenticate, importTransactions);
router.get('/', authenticate, getTransactions);
router.get('/analyze', authenticate, analyzeSpending);
router.post('/budget', authenticate, setBudget);
router.get('/budget', authenticate, getBudget);
router.get('/export', authenticate, exportTransactions);
router.post('/clear', authenticate, clearTransactions);
router.get('/recommendations', authenticate, getRecommendations);

export default router;
