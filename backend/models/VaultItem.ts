import mongoose, { Document, Schema } from 'mongoose';

export interface IVaultItem extends Document {
  userId: mongoose.Types.ObjectId;
  encryptedData: string; // This will contain the encrypted JSON of all fields
  title: string; // Stored in plaintext for search functionality
  url?: string; // Stored in plaintext for easy access
  createdAt: Date;
  updatedAt: Date;
}

const VaultItemSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  encryptedData: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    trim: true,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
VaultItemSchema.pre<IVaultItem>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Create index for faster queries
VaultItemSchema.index({ userId: 1, title: 'text' });

export default mongoose.model<IVaultItem>('VaultItem', VaultItemSchema);
