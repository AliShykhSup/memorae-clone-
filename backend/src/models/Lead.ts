import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  campaignId: mongoose.Types.ObjectId;
  username: string;
  displayName: string;
  isDemo: boolean;
  createdAt: Date;
}

const LeadSchema: Schema = new Schema({
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  isDemo: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<ILead>('Lead', LeadSchema);
