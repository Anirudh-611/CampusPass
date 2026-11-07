import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const idCardSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'ID Card must be linked to a Student record'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'ID Card must be linked to a User account'],
      index: true,
    },
    cardNumber: {
      type: String,
      unique: true,
      sparse: true, // allows null until approved
      index: true,
    },
    verificationId: {
      type: String,
      unique: true,
      default: () => uuidv4(),
      index: true,
    },
    template: {
      type: String,
      enum: {
        values: ['minimal', 'dark', 'classic'],
        message: 'Template must be minimal, dark, or classic',
      },
      default: 'minimal',
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'APPROVED', 'REJECTED', 'REVOKED'],
        message: 'Invalid ID card status',
      },
      default: 'PENDING',
      index: true,
    },
    validUntil: {
      type: String,
      default: 'July 2027',
    },
    issueDate: {
      type: Date,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    revokedReason: {
      type: String,
      trim: true,
    },
    revokedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const IDCard = mongoose.model('IDCard', idCardSchema);
export default IDCard;

