import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  userId: mongoose.Types.ObjectId;
  fileUrl: string;
  fileType: string;
  originalName: string;
  extractedText?: string;
  summary?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
}

const ReportSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    originalName: { type: String, required: true },
    extractedText: { type: String },
    summary: { type: String },
    status: { 
      type: String, 
      enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
      default: 'PENDING'
    },
  },
  { timestamps: true }
);

export default mongoose.model<IReport>('Report', ReportSchema);
