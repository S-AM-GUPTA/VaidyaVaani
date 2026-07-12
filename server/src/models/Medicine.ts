import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicine extends Document {
  prescriptionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  purpose?: string;
  dosage?: string;
  timing?: string;
  foodInstructions?: string;
  warnings?: string;
  createdAt: Date;
}

const MedicineSchema: Schema = new Schema(
  {
    prescriptionId: { type: Schema.Types.ObjectId, ref: 'Prescription', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    purpose: { type: String },
    dosage: { type: String },
    timing: { type: String },
    foodInstructions: { type: String },
    warnings: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IMedicine>('Medicine', MedicineSchema);
