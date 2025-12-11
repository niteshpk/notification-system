import express from 'express';
import { triggerNotification, getNotificationLogs } from '../controllers/notificationController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Triggering might be public (with API Key in future) or protected
// For now, let's keep it protected for dashboard testing
router.post('/send', protect, triggerNotification);
router.get('/logs', protect, getNotificationLogs);

export default router;

