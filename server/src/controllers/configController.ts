import { Request, Response } from 'express';
import NotificationConfig from '../models/NotificationConfig';

export const getConfigs = async (req: Request, res: Response) => {
  try {
    const configs = await NotificationConfig.find({});
    res.json(configs);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createOrUpdateConfig = async (req: Request, res: Response) => {
  const { provider, providerId, credentials, isActive } = req.body;

  try {
    let config = await NotificationConfig.findOne({ provider, providerId });

    if (config) {
      config.credentials = credentials;
      config.isActive = isActive !== undefined ? isActive : config.isActive;
      await config.save();
      res.json(config);
    } else {
      config = await NotificationConfig.create({
        provider,
        providerId,
        credentials,
        isActive,
      });
      res.status(201).json(config);
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteConfig = async (req: Request, res: Response) => {
    try {
        const config = await NotificationConfig.findById(req.params.id);
        if (config) {
            await config.deleteOne();
            res.json({ message: 'Config removed' });
        } else {
            res.status(404).json({ message: 'Config not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

