import mongoose, { Schema, Document } from 'mongoose';

export interface IInstagramAccount extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  displayName: string;
  isActive: boolean;
  createdAt: Date;
}

const InstagramAccountSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IInstagramAccount>('InstagramAccount', InstagramAccountSchema);
