import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  otp: string;
  otpExpiresAt: Date;
  isVerified: boolean;
  createdAt: Date;
}

const SessionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    otp: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// TTL index to automatically delete unverified sessions after 10 minutes
SessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

export default mongoose.model<ISession>('Session', SessionSchema);
