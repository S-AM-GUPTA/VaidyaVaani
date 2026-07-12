import mongoose, { Document, Schema } from 'mongoose';

export interface IPrescription extends Document {
  userId: mongoose.Types.ObjectId;
  fileUrl: string;
  extractedText?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
}

const PrescriptionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true },
    extractedText: { type: String },
    status: { 
      type: String, 
      enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
      default: 'PENDING'
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPrescription>('Prescription', PrescriptionSchema);
