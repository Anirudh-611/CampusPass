import Student from '../models/Student.js';
import { AppError } from '../utils/customError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Get logged-in student profile
 * @route   GET /api/students/profile
 * @access  Private (Student)
 */
export const getProfile = asyncHandler(async (req, res, next) => {
  const student = await Student.findOne({ user: req.user._id });

  if (!student) {
    return next(new AppError('No student profile found for this user account.', 404));
  }

  res.status(200).json({
    success: true,
    data: student,
  });
});

/**
 * @desc    Update student personal & academic details
 * @route   PUT /api/students/profile
 * @access  Private (Student)
 */
export const updateProfile = asyncHandler(async (req, res, next) => {
  const allowedUpdates = [
    'fullName',
    'phone',
    'address',
    'dateOfBirth',
    'gender',
    'bloodGroup',
    'collegeName',
    'department',
    'course',
    'yearOfStudy',
    'currentSemester',
    'academicBatch',
    'graduationYear',
    'avatarUrl',
  ];

  const updates = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const student = await Student.findOneAndUpdate(
    { user: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!student) {
    return next(new AppError('Student profile record not found.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: student,
  });
});

/**
 * @desc    Upload official profile photo
 * @route   POST /api/students/photo
 * @access  Private (Student)
 */
export const uploadPhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please select an image file to upload.', 400));
  }

  // Convert uploaded buffer into base64 Data URI for immediate persistence & CDN compatibility
  const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

  const student = await Student.findOneAndUpdate(
    { user: req.user._id },
    { avatarUrl: base64Image },
    { new: true }
  );

  if (!student) {
    return next(new AppError('Student profile not found.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Profile photograph uploaded successfully',
    data: {
      avatarUrl: student.avatarUrl,
    },
  });
});

