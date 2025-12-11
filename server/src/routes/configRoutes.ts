import express from 'express';
import { getConfigs, createOrUpdateConfig, deleteConfig } from '../controllers/configController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/').get(protect, getConfigs).post(protect, createOrUpdateConfig);
router.route('/:id').delete(protect, deleteConfig);

export default router;

