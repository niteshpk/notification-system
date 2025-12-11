import api from './api';

export interface SendNotificationParams {
  channel: 'email' | 'sms' | 'push' | 'slack';
  recipient: string;
  subject?: string;
  content: string;
}

export interface NotificationLog {
  _id: string;
  channel: string;
  recipient: string;
  subject?: string;
  content: string;
  status: 'pending' | 'sent' | 'failed';
  error?: string;
  sentAt?: string;
  createdAt: string;
}

export const sendTestNotification = async (params: SendNotificationParams): Promise<NotificationLog> => {
  const response = await api.post('/notifications/send', params);
  return response.data;
};

export const getNotificationLogs = async (): Promise<NotificationLog[]> => {
  const response = await api.get('/notifications/logs');
  return response.data;
};

