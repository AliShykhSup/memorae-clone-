import mongoose, { Schema, Document } from 'mongoose';

export interface ICampaign extends Document {
  userId: mongoose.Types.ObjectId;
  instagramAccountId: mongoose.Types.ObjectId;
  name: string;
  targetAudience: string;
  message: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: Date;
  activatedAt?: Date;
}

const CampaignSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  instagramAccountId: {
    type: Schema.Types.ObjectId,
    ref: 'InstagramAccount',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  targetAudience: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  activatedAt: {
    type: Date
  }
});

export default mongoose.model<ICampaign>('Campaign', CampaignSchema);
