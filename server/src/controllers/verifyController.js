import IDCard from '../models/IDCard.js';
import VerificationLog from '../models/VerificationLog.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Public Zero-Trust QR Identity Verification Endpoint
 * @route   GET /api/verify/:verificationId
 * @access  Public Edge (No Auth Required)
 */
export const verifyCard = asyncHandler(async (req, res) => {
  const { verificationId } = req.params;
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Unknown Browser';

  // 1. Look up card in database
  const card = await IDCard.findOne({ verificationId }).populate('student');

  // Case A: Card not found in university database
  if (!card || !card.student) {
    await VerificationLog.create({
      verificationId,
      statusResult: 'INVALID',
      ipAddress: clientIp,
      userAgent,
    });

    return res.status(200).json({
      success: true,
      data: {
        statusResult: 'INVALID',
        isAuthentic: false,
        verificationId,
        message: 'No official campus record exists for this verification identifier.',
        verifiedAt: new Date().toISOString(),
      },
    });
  }

  // Case B: Card found -> Determine status
  let finalStatus = card.status; // 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED'
  let isAuthentic = card.status === 'APPROVED';

  // Log verification event into immutable audit trail
  await VerificationLog.create({
    idCard: card._id,
    verificationId,
    statusResult: finalStatus === 'APPROVED' ? 'VERIFIED' : finalStatus,
    ipAddress: clientIp,
    userAgent,
  });

  // Safe Public Response: NO phone, NO address, NO blood group!
  res.status(200).json({
    success: true,
    data: {
      statusResult: finalStatus === 'APPROVED' ? 'VERIFIED' : finalStatus,
      isAuthentic,
      verificationId: card.verificationId,
      cardNumber: card.cardNumber || 'PENDING-ISSUANCE',
      template: card.template,
      validUntil: card.validUntil,
      issueDate: card.issueDate,
      institution: card.student.collegeName,
      institutionCode: 'ASIT-REG-2026',
      student: {
        fullName: card.student.fullName,
        rollNumber: card.student.rollNumber,
        department: card.student.department,
        course: card.student.course,
        academicBatch: card.student.academicBatch,
        avatarUrl: card.student.avatarUrl,
      },
      verifiedAt: new Date().toISOString(),
    },
  });
});

