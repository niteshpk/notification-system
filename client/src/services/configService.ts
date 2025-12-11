import api from './api';

export interface NotificationConfig {
  _id?: string;
  provider: 'email' | 'sms' | 'fcm' | 'slack';
  providerId: string;
  credentials: Record<string, any>;
  isActive: boolean;
}

export const getConfigs = async (): Promise<NotificationConfig[]> => {
  const response = await api.get('/config');
  return response.data;
};

export const createOrUpdateConfig = async (config: NotificationConfig): Promise<NotificationConfig> => {
  const response = await api.post('/config', config);
  return response.data;
};

export const deleteConfig = async (id: string): Promise<void> => {
  await api.delete(`/config/${id}`);
};

