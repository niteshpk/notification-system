import { Request, Response } from 'express';
import { sendNotification } from '../services/notificationService';
import NotificationLog from '../models/NotificationLog';

export const triggerNotification = async (req: Request, res: Response) => {
  const { channel, recipient, subject, content } = req.body;
  
  // Optional: get userId from req.user if authenticated
  // @ts-ignore
  const userId = req.user?._id;

  try {
    const result = await sendNotification({
      channel,
      recipient,
      subject,
      content,
      userId
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getNotificationLogs = async (req: Request, res: Response) => {
    try {
        const logs = await NotificationLog.find({}).sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

