import mongoose, { Document, Schema } from 'mongoose';

export interface INotificationConfig extends Document {
  provider: 'email' | 'sms' | 'fcm' | 'slack';
  providerId: string; // e.g., 'sendgrid', 'twilio'
  credentials: Record<string, any>; // Encrypted or stored securely
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationConfigSchema: Schema = new Schema(
  {
    provider: { type: String, required: true, enum: ['email', 'sms', 'fcm', 'slack'] },
    providerId: { type: String, required: true }, // e.g., 'twilio', 'sendgrid'
    credentials: { type: Schema.Types.Mixed, required: true }, // Store API keys, tokens, etc.
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Compound index to ensure one active config per provider type/id if needed,
// but for now just simple indexing.
NotificationConfigSchema.index({ provider: 1, providerId: 1 }, { unique: true });

export default mongoose.model<INotificationConfig>('NotificationConfig', NotificationConfigSchema);

