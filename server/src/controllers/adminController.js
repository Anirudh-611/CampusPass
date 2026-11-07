import IDCard from '../models/IDCard.js';
import Student from '../models/Student.js';
import VerificationLog from '../models/VerificationLog.js';
import { AppError } from '../utils/customError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Get aggregated system statistics for admin dashboard
 * @route   GET /api/admin/dashboard-stats
 * @access  Private (Admin)
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    pendingCards,
    approvedCards,
    revokedCards,
    totalVerifications,
    recentPending,
  ] = await Promise.all([
    Student.countDocuments(),
    IDCard.countDocuments({ status: 'PENDING' }),
    IDCard.countDocuments({ status: 'APPROVED' }),
    IDCard.countDocuments({ status: 'REVOKED' }),
    VerificationLog.countDocuments(),
    IDCard.find({ status: 'PENDING' })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('student'),
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalStudents,
        pendingCards,
        approvedCards,
        revokedCards,
        totalVerifications,
      },
      recentPending,
    },
  });
});

/**
 * @desc    Get all card applications with filters & search
 * @route   GET /api/admin/cards
 * @access  Private (Admin)
 */
export const getAllCards = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const filter = {};

  if (status && status !== 'ALL') {
    filter.status = status.toUpperCase();
  }

  let cards = await IDCard.find(filter)
    .populate('student')
    .sort({ updatedAt: -1 });

  // Client search filter across populated student fields
  if (search) {
    const q = search.toLowerCase();
    cards = cards.filter(
      (c) =>
        c.student &&
        (c.student.fullName.toLowerCase().includes(q) ||
          c.student.rollNumber.toLowerCase().includes(q) ||
          c.student.department.toLowerCase().includes(q))
    );
  }

  res.status(200).json({
    success: true,
    count: cards.length,
    data: cards,
  });
});

/**
 * @desc    Get all registered students with department filter
 * @route   GET /api/admin/students
 * @access  Private (Admin)
 */
export const getAllStudents = asyncHandler(async (req, res) => {
  const { department, search } = req.query;
  const filter = {};

  if (department && department !== 'ALL') {
    filter.department = department;
  }

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { rollNumber: { $regex: search, $options: 'i' } },
    ];
  }

  const students = await Student.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: students.length,
    data: students,
  });
});

/**
 * @desc    Approve a student ID card application
 * @route   PATCH /api/admin/cards/:id/approve
 * @access  Private (Admin)
 */
export const approveCard = asyncHandler(async (req, res, next) => {
  const card = await IDCard.findById(req.params.id).populate('student');

  if (!card) {
    return next(new AppError('ID Card application not found.', 404));
  }

  // Generate unique card number if not assigned yet
  if (!card.cardNumber) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const rollPart = card.student?.rollNumber ? card.student.rollNumber.replace(/[^a-zA-Z0-9]/g, '').slice(-4) : '2026';
    card.cardNumber = `CP-${rollPart}-${randomSuffix}`;
  }

  card.status = 'APPROVED';
  card.issueDate = new Date();
  card.reviewedBy = req.user._id;
  card.reviewedAt = new Date();
  card.rejectionReason = undefined;

  await card.save();

  res.status(200).json({
    success: true,
    message: 'ID Card approved and activated with cryptographic verification badge.',
    data: card,
  });
});

/**
 * @desc    Reject a student ID card application
 * @route   PATCH /api/admin/cards/:id/reject
 * @access  Private (Admin)
 */
export const rejectCard = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;
  const card = await IDCard.findById(req.params.id);

  if (!card) {
    return next(new AppError('ID Card record not found.', 404));
  }

  card.status = 'REJECTED';
  card.rejectionReason = reason || 'Photograph or enrollment detail non-compliant with campus standards.';
  card.reviewedBy = req.user._id;
  card.reviewedAt = new Date();

  await card.save();

  res.status(200).json({
    success: true,
    message: 'ID Card application rejected.',
    data: card,
  });
});

/**
 * @desc    Revoke an active ID card immediately
 * @route   PATCH /api/admin/cards/:id/revoke
 * @access  Private (Admin)
 */
export const revokeCard = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;
  const card = await IDCard.findById(req.params.id);

  if (!card) {
    return next(new AppError('ID Card record not found.', 404));
  }

  card.status = 'REVOKED';
  card.revokedReason = reason || 'Card reported lost, stolen, or student status suspended.';
  card.revokedAt = new Date();

  await card.save();

  res.status(200).json({
    success: true,
    message: 'ID Card revoked successfully. Immediate scanning attempts will report status as REVOKED.',
    data: card,
  });
});

