import mongoose, { Document, Schema } from 'mongoose';

export interface IPreference extends Document {
  userId: string; // The ID of the recipient user in the *target* system (not necessarily a dashboard admin)
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
    slack: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PreferenceSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    channels: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      slack: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPreference>('Preference', PreferenceSchema);

