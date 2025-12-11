import mongoose, { Document, Schema } from 'mongoose';

export interface INotificationLog extends Document {
  userId?: string; // Optional: linked to a specific dashboard user if triggered manually
  channel: 'email' | 'sms' | 'push' | 'slack';
  recipient: string;
  subject?: string;
  content: string;
  status: 'pending' | 'sent' | 'failed';
  providerResponse?: any; // Raw response from the third-party service
  error?: string;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationLogSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    channel: { type: String, required: true },
    recipient: { type: String, required: true },
    subject: { type: String },
    content: { type: String, required: true },
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    providerResponse: { type: Schema.Types.Mixed },
    error: { type: String },
    sentAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<INotificationLog>('NotificationLog', NotificationLogSchema);

