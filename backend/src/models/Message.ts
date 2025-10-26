import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  campaignId: mongoose.Types.ObjectId;
  leadId: mongoose.Types.ObjectId;
  content: string;
  status: 'sent' | 'failed' | 'pending';
  sentAt: Date;
  isDemo: boolean;
}

const MessageSchema: Schema = new Schema({
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  leadId: {
    type: Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'failed', 'pending'],
    default: 'sent'
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  isDemo: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model<IMessage>('Message', MessageSchema);
