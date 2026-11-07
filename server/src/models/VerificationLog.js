import mongoose from 'mongoose';

const verificationLogSchema = new mongoose.Schema(
  {
    idCard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IDCard',
    },
    verificationId: {
      type: String,
      required: true,
      index: true,
    },
    statusResult: {
      type: String,
      enum: ['VERIFIED', 'PENDING', 'EXPIRED', 'REVOKED', 'INVALID'],
      required: true,
    },
    ipAddress: {
      type: String,
      default: 'Unknown IP',
    },
    userAgent: {
      type: String,
      default: 'Unknown Device',
    },
    verifiedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

const VerificationLog = mongoose.model('VerificationLog', verificationLogSchema);
export default VerificationLog;

