import IDCard from '../models/IDCard.js';
import Student from '../models/Student.js';
import { AppError } from '../utils/customError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Apply for or update digital ID card template
 * @route   POST /api/id-cards/apply
 * @access  Private (Student)
 */
export const applyForCard = asyncHandler(async (req, res, next) => {
  const { template } = req.body;

  const student = await Student.findOne({ user: req.user._id });
  if (!student) {
    return next(new AppError('Please complete your student profile before applying for an ID card.', 400));
  }

  let card = await IDCard.findOne({ student: student._id });

  if (!card) {
    card = await IDCard.create({
      student: student._id,
      user: req.user._id,
      template: template || 'minimal',
      status: 'PENDING',
    });
  } else {
    // If card was rejected or pending, allow re-applying or template update
    card.template = template || card.template;
    if (card.status === 'REJECTED') {
      card.status = 'PENDING';
      card.rejectionReason = undefined;
    }
    await card.save();
  }

  res.status(200).json({
    success: true,
    message: 'Card application submitted for administrative review',
    data: card,
  });
});

/**
 * @desc    Get currently logged-in student's ID card
 * @route   GET /api/id-cards/my-card
 * @access  Private (Student)
 */
export const getMyCard = asyncHandler(async (req, res, next) => {
  const student = await Student.findOne({ user: req.user._id });
  if (!student) {
    return next(new AppError('No student record found.', 404));
  }

  const card = await IDCard.findOne({ student: student._id }).populate('student');

  if (!card) {
    return next(new AppError('No digital ID card found for this student account.', 404));
  }

  res.status(200).json({
    success: true,
    data: card,
  });
});

