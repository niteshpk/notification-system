import NotificationLog from '../models/NotificationLog';
import NotificationConfig from '../models/NotificationConfig';

interface SendNotificationParams {
  channel: 'email' | 'sms' | 'push' | 'slack';
  recipient: string;
  subject?: string;
  content: string;
  userId?: string;
}

export const sendNotification = async (params: SendNotificationParams) => {
  const { channel, recipient, subject, content, userId } = params;

  // 1. Check if provider is configured
  // In a real scenario, we might look up a specific providerId based on preferences
  // For now, we just check if ANY config exists for this channel
  const config = await NotificationConfig.findOne({ provider: channel, isActive: true });

  if (!config) {
    throw new Error(`No active configuration found for channel: ${channel}`);
  }

  // 2. "Send" the notification (Mock implementation)
  console.log(`Sending ${channel} to ${recipient} via ${config.providerId}...`);
  
  // Simulate API call
  const success = true; 
  const providerResponse = { id: 'mock-id-123', status: 'queued' };

  // 3. Log the result
  const log = await NotificationLog.create({
    userId,
    channel,
    recipient,
    subject,
    content,
    status: success ? 'sent' : 'failed',
    providerResponse,
    sentAt: new Date(),
  });

  return log;
};

